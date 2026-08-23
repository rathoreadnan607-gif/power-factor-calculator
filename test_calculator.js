const PFEngine = require('./calculator.js');

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

console.log("=== Testing Power Factor Calculation Engine ===");

// Test 1: Zero / Empty inputs
const res0 = PFEngine.calculateBillPF({
    energyPeak: 0,
    energyOffPeak: 0,
    reactivePeak: 0,
    reactiveOffPeak: 0,
    desiredPF: 0.95
});
assert(res0.currentPF === 0, "Zero input gives 0 current PF");
assert(res0.requiredCompensation === 0, "Zero input gives 0 required compensation");
assert(res0.status === "NO_DATA", "Status is NO_DATA when inputs are empty");

// Test 2: Standard industrial bill
// Peak kWh: 25000, OffPeak kWh: 35000 -> Total Active = 60000 kWh
// Peak kVARh: 20000, OffPeak kVARh: 28000 -> Total Reactive = 48000 kVARh
// Desired PF = 0.95
const res1 = PFEngine.calculateBillPF({
    energyPeak: 25000,
    energyOffPeak: 35000,
    reactivePeak: 20000,
    reactiveOffPeak: 28000,
    desiredPF: 0.95
});

// Apparent = sqrt(60000^2 + 48000^2) = sqrt(3,600,000,000 + 2,304,000,000) = sqrt(5,904,000,000) = 76837.4908
// PF = 60000 / 76837.4908 = 0.78087
console.log("Calculated Current PF:", res1.currentPF.toFixed(4));
assert(Math.abs(res1.currentPF - 0.78087) < 0.001, "Current PF calculation matches formula (approx 0.7809)");

// Target reactive = 60000 * tan(acos(0.95))
// acos(0.95) = 0.31756 rad, tan = 0.328684
// Target reactive = 60000 * 0.328684 = 19721.04 kVARh
// Required compensation = 48000 - 19721.04 = 28278.96 kVAR
console.log("Required compensation (kVAR):", res1.requiredCompensation.toFixed(2));
assert(Math.abs(res1.requiredCompensation - 28278.96) < 1.0, "Required compensation matches Excel formula (28278.96)");
console.log("Recommendation text:", res1.recommendationText);
assert(res1.stepBreakdown.step100 === 282, "Step 100 count is 282");
assert(res1.stepBreakdown.step50 === 1, "Step 50 count is 1");
assert(res1.stepBreakdown.step25 === 1, "Step 25 count is 1");

// Test 3: Desired PF already achieved
const resGood = PFEngine.calculateBillPF({
    energyPeak: 50000,
    energyOffPeak: 50000,
    reactivePeak: 10000,
    reactiveOffPeak: 10000,
    desiredPF: 0.95
});
// Total active = 100000, total reactive = 20000 -> PF = 100000 / sqrt(100000^2 + 20000^2) = 0.98058
console.log("High PF test current PF:", resGood.currentPF.toFixed(4));
assert(resGood.currentPF > 0.95, "Current PF is above 0.95");
assert(resGood.requiredCompensation === 0, "No compensation required when PF is already >= 0.95");
assert(resGood.status === "OPTIMAL", "Status is OPTIMAL");

// Test 4: Existing Capacitor Bank Audit
const bankRes = PFEngine.calculateExistingBank({
    s100: 2,   // 200
    s50: 1,    // 50
    s25: 1,    // 25
    s12_5: 1,  // 12.5
    s7_5: 0,
    s5: 0,
    s3_5: 0,
    s2_5: 0
}, 300); // Need 300 kVAR

assert(bankRes.totalInstalled === 287.5, "Installed capacity is 287.5 kVAR");
assert(bankRes.netAdditionalRequired === 12.5, "Net additional required is 12.5 kVAR");

// Test 5: Transformer No-Load Compensation
const tx500 = PFEngine.calculateTransformerNoLoad(500);
assert(tx500.estimatedNoLoadRequirement === 50, "500 kVA tx needs 50 kVAR");
assert(tx500.recommendedStep === 50, "500 kVA tx step is 50 kVAR");

const tx630 = PFEngine.calculateTransformerNoLoad(630);
assert(tx630.estimatedNoLoadRequirement === 63, "630 kVA tx needs 63 kVAR");
assert(tx630.recommendedStep === 100, "630 kVA (req 63) step chooses 100 kVAR per ceiling bracket");

const tx1000 = PFEngine.calculateTransformerNoLoad(1000);
assert(tx1000.estimatedNoLoadRequirement === 100, "1000 kVA tx needs 100 kVAR");
assert(tx1000.recommendedStep === 100, "1000 kVA tx step is 100 kVAR");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
