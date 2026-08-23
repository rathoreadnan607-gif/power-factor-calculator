/**
 * Power Factor & Capacitor Bank Diagnostic Engine
 * Formulas sourced from: Power factor Calculator.xlsx (Engineering Calculations sheet)
 * K-Electric PFI Team | power.factor@ke.com.pk
 */

const PFEngine = {
    /**
     * Standard steps as per K-Electric Engineering Specification
     */
    STANDARD_STEPS: [100, 50, 25, 12.5, 7.5, 5, 3.5, 2.5],

    /**
     * Calculate Bill-Based Power Factor & Compensation Requirements
     *
     * Key Excel formulas (Engineering Calculations sheet):
     *   B12 = IFERROR((B5+B6)/SQRT((B5+B6)^2+(B7+B8)^2), 0)  ← Current PF
     *   B13 = B5+B6                                             ← Total Active kWh
     *   B14 = B7+B8                                             ← Total Reactive kVARh
     *   B15 = B13*TAN(ACOS(B10))                                ← Target Reactive kVARh
     *   B16 = MAX(0, B14-B15)                                   ← Required Compensation (energy basis)
     *   B17 = MAX(0, B9*(TAN(ACOS(B12))-TAN(ACOS(B10))))       ← Required kVAR using MDI
     *
     *   Step breakdown (B20–B27):
     *   B20 = INT(B17/100)
     *   B21 = INT(MAX(0, B17-B20*100)/50)
     *   B22 = INT(MAX(0, ...)/25)
     *   B23 = INT(MAX(0, ...)/12.5)
     *   B24 = INT(MAX(0, ...)/7.5)
     *   B25 = INT(MAX(0, ...)/5)
     *   B26 = INT(MAX(0, ...)/3.5)
     *   B27 = IF(residual>0, 1, 0)   ← 2.5 kVAR trim flag
     *   B28 = total recommended bank kVAR
     *
     * @param {Object} inputs
     * @param {number} inputs.energyPeak       - kWh (Energy - Peak from bill)
     * @param {number} inputs.energyOffPeak    - kWh (Energy - Off Peak from bill)
     * @param {number} inputs.reactivePeak     - kVARh (Reactive Energy - Peak from bill)
     * @param {number} inputs.reactiveOffPeak  - kVARh (Reactive Energy - Off Peak from bill)
     * @param {number} inputs.mdi              - MDI (kW) from bill
     * @param {number} inputs.desiredPF        - target PF (e.g., 0.95)
     * @returns {Object} Calculated metrics
     */
    calculateBillPF(inputs) {
        const energyPeak      = Math.max(0, Number(inputs.energyPeak)      || 0);
        const energyOffPeak   = Math.max(0, Number(inputs.energyOffPeak)   || 0);
        const reactivePeak    = Math.max(0, Number(inputs.reactivePeak)    || 0);
        const reactiveOffPeak = Math.max(0, Number(inputs.reactiveOffPeak) || 0);
        const mdi             = Math.max(0, Number(inputs.mdi)             || 0);
        const desiredPF       = Math.min(1.0, Math.max(0.5, Number(inputs.desiredPF) || 0.95));

        // B13, B14
        const totalActiveEnergy   = energyPeak + energyOffPeak;
        const totalReactiveEnergy = reactivePeak + reactiveOffPeak;

        // B12: IFERROR((B5+B6)/SQRT((B5+B6)^2+(B7+B8)^2), 0)
        let currentPF = 0;
        let apparentEnergy = 0;
        if (totalActiveEnergy > 0 || totalReactiveEnergy > 0) {
            apparentEnergy = Math.sqrt(Math.pow(totalActiveEnergy, 2) + Math.pow(totalReactiveEnergy, 2));
            currentPF = apparentEnergy > 0 ? (totalActiveEnergy / apparentEnergy) : 0;
        }

        // B15: Target reactive energy (energy basis)
        // B16: MAX(0, B14-B15)
        let targetReactive        = 0;
        let requiredCompensationE = 0;
        if (totalActiveEnergy > 0 && desiredPF > 0 && desiredPF < 1) {
            targetReactive        = totalActiveEnergy * Math.tan(Math.acos(desiredPF));
            requiredCompensationE = Math.max(0, totalReactiveEnergy - targetReactive);
        } else if (desiredPF >= 1) {
            targetReactive        = 0;
            requiredCompensationE = Math.max(0, totalReactiveEnergy);
        }

        // B17: MAX(0, MDI * (TAN(ACOS(currentPF)) - TAN(ACOS(desiredPF))))
        // Primary MDI-based kVAR sizing (practical for capacitor bank selection)
        let requiredCompensation = 0;
        if (mdi > 0 && currentPF > 0 && currentPF < 1 && desiredPF > 0 && desiredPF < 1) {
            requiredCompensation = Math.max(0,
                mdi * (Math.tan(Math.acos(Math.min(currentPF, 0.9999))) - Math.tan(Math.acos(desiredPF)))
            );
        } else {
            // Fallback to energy-basis if MDI not entered
            requiredCompensation = requiredCompensationE;
        }

        // ─── Step Breakdown (B20–B27) ─────────────────────────────────
        const step100 = Math.floor(requiredCompensation / 100);
        let rem = requiredCompensation - step100 * 100;

        const step50 = Math.floor(Math.max(0, rem) / 50);
        rem = Math.max(0, rem - step50 * 50);

        const step25 = Math.floor(Math.max(0, rem) / 25);
        rem = Math.max(0, rem - step25 * 25);

        const step12_5 = Math.floor(Math.max(0, rem) / 12.5);
        rem = Math.max(0, rem - step12_5 * 12.5);

        const step7_5 = Math.floor(Math.max(0, rem) / 7.5);
        rem = Math.max(0, rem - step7_5 * 7.5);

        const step5 = Math.floor(Math.max(0, rem) / 5);
        rem = Math.max(0, rem - step5 * 5);

        const step3_5 = Math.floor(Math.max(0, rem) / 3.5);
        rem = Math.max(0, rem - step3_5 * 3.5);

        // B27: IF(residual>0, 1, 0)
        const step2_5 = (rem > 0.05) ? 1 : 0;
        const residual = rem;

        // B28: Total recommended bank
        const totalRecommendedBank =
            step100 * 100 + step50 * 50 + step25 * 25 + step12_5 * 12.5 +
            step7_5 * 7.5 + step5 * 5 + step3_5 * 3.5 + step2_5 * 2.5;

        // B29: Step configuration text
        const parts = [];
        if (step100  > 0) parts.push(`${step100} \u00d7 100 kVAR`);
        if (step50   > 0) parts.push(`${step50} \u00d7 50 kVAR`);
        if (step25   > 0) parts.push(`${step25} \u00d7 25 kVAR`);
        if (step12_5 > 0) parts.push(`${step12_5} \u00d7 12.5 kVAR`);
        if (step7_5  > 0) parts.push(`${step7_5} \u00d7 7.5 kVAR`);
        if (step5    > 0) parts.push(`${step5} \u00d7 5 kVAR`);
        if (step3_5  > 0) parts.push(`${step3_5} \u00d7 3.5 kVAR`);
        if (step2_5  > 0) parts.push(`${step2_5} \u00d7 2.5 kVAR`);
        const recommendationText = parts.length > 0
            ? parts.join('  +  ')
            : 'No additional capacity required';

        // Status
        let status = 'NO_DATA';
        let statusMessage = 'Enter bill values to calculate.';
        let statusType = 'neutral';

        if (totalActiveEnergy > 0 || totalReactiveEnergy > 0) {
            if (currentPF >= desiredPF) {
                status = 'OPTIMAL';
                statusMessage = '\u2713 PF is at or above the desired target.';
                statusType = 'success';
            } else {
                status = 'BELOW_TARGET';
                statusMessage = '\u26a0 PF is below the desired target \u2014 capacitor compensation is recommended.';
                statusType = 'warning';
            }
        }

        // Power angles
        const currentAngleDeg = currentPF > 0 ? (Math.acos(Math.min(1, currentPF)) * 180 / Math.PI) : 0;
        const targetAngleDeg  = Math.acos(desiredPF) * 180 / Math.PI;

        const newApparentEnergy       = Math.sqrt(Math.pow(totalActiveEnergy, 2) + Math.pow(targetReactive, 2));
        const currentReductionPercent = apparentEnergy > 0
            ? ((1 - newApparentEnergy / apparentEnergy) * 100) : 0;

        return {
            totalActiveEnergy,
            totalReactiveEnergy,
            apparentEnergy,
            currentPF,
            desiredPF,
            mdi,
            targetReactive,
            requiredCompensationE,
            requiredCompensation,
            totalRecommendedBank,
            stepBreakdown: { step100, step50, step25, step12_5, step7_5, step5, step3_5, step2_5, residual },
            recommendationText,
            status,
            statusMessage,
            statusType,
            currentAngleDeg,
            targetAngleDeg,
            newApparentEnergy,
            currentReductionPercent
        };
    },

    /**
     * Calculate Existing Capacitor Bank Installed Capacity & Deficit
     *
     * Excel: B41 = B33*100 + B34*50 + B35*25 + B36*12.5 + B37*7.5 + B38*5 + B39*3.5 + B40*2.5
     *        B42 = IF(B41>=B17, "sufficient", "below requirement")
     *
     * @param {Object} counts
     * @param {number} requiredCompensation
     * @returns {Object}
     */
    calculateExistingBank(counts, requiredCompensation = 0) {
        const stepValues = {
            s100: 100, s50: 50, s25: 25, s12_5: 12.5,
            s7_5: 7.5, s5: 5.0, s3_5: 3.5, s2_5: 2.5
        };

        let totalInstalled = 0;
        const inventory = {};

        for (const [key, rating] of Object.entries(stepValues)) {
            const qty = Math.max(0, parseInt(counts[key], 10) || 0);
            inventory[key] = { rating, qty, subtotal: qty * rating };
            totalInstalled += qty * rating;
        }

        const netAdditionalRequired = Math.max(0, requiredCompensation - totalInstalled);
        const surplusCapacity       = Math.max(0, totalInstalled - requiredCompensation);
        const isAdequate = requiredCompensation > 0 && totalInstalled >= requiredCompensation;

        return {
            totalInstalled,
            netAdditionalRequired,
            surplusCapacity,
            inventory,
            isAdequate,
            adequacyText: isAdequate
                ? 'Installed bank is theoretically sufficient'
                : 'Installed bank is below estimated requirement'
        };
    },

    /**
     * Calculate Transformer No-Load Reactive Compensation
     *
     * Excel formulas (Engineering Calculations sheet):
     *   B54 = B53 * IF(B53<=315, 0.0175, IF(B53<=630, 0.015, IF(B53<=1000, 0.0125, 0.01)))
     *          → Estimated No-load kVA (rating-band loss %)
     *   B55 = B53 * IF(B53<=315, 0.0018, IF(B53<=630, 0.0019, IF(B53<=1000, 0.0017, 0.0016)))
     *          → Estimated No-load kW (iron-loss %)
     *   B56 = SQRT(MAX(0, B54^2 - B55^2))
     *          → Estimated No-load kVAR
     *   B57 = step rounding (2.5, 3.5, 5, 7.5, 12.5, 25, 50, 100, or CEILING(B56, 2.5))
     *
     * @param {number} ratingKVA
     * @param {number} shutdownLoadKW
     * @returns {Object}
     */
    calculateTransformerNoLoad(ratingKVA, shutdownLoadKW = 0) {
        const kva = Math.max(0, Number(ratingKVA)     || 0);
        const kw  = Math.max(0, Number(shutdownLoadKW) || 0);

        if (kva <= 0) {
            return {
                kva, shutdownLoadKW: kw,
                noLoadKVA: 0, noLoadKW: 0,
                estimatedNoLoadRequirement: 0,
                recommendedStep: 0,
                recommendedStepText: 'None',
                note: 'Enter transformer rating to calculate no-load compensation.'
            };
        }

        // B54: No-load kVA by rating band
        const noLoadKVA = kva * (kva <= 315 ? 0.0175 : kva <= 630 ? 0.015 : kva <= 1000 ? 0.0125 : 0.01);

        // B55: No-load kW by rating band
        const noLoadKW  = kva * (kva <= 315 ? 0.0018 : kva <= 630 ? 0.0019 : kva <= 1000 ? 0.0017 : 0.0016);

        // B56: No-load kVAR
        const estimatedNoLoadRequirement = Math.sqrt(Math.max(0, Math.pow(noLoadKVA, 2) - Math.pow(noLoadKW, 2)));

        // B57: Step rounding
        const req = estimatedNoLoadRequirement;
        let recommendedStep = 0;
        if      (req <= 0)    recommendedStep = 0;
        else if (req <= 2.5)  recommendedStep = 2.5;
        else if (req <= 3.5)  recommendedStep = 3.5;
        else if (req <= 5.0)  recommendedStep = 5.0;
        else if (req <= 7.5)  recommendedStep = 7.5;
        else if (req <= 12.5) recommendedStep = 12.5;
        else if (req <= 25.0) recommendedStep = 25.0;
        else if (req <= 50.0) recommendedStep = 50.0;
        else if (req <= 100)  recommendedStep = 100;
        else recommendedStep = Math.ceil(req / 2.5) * 2.5;

        const stepLabels = {
            0:'None', 2.5:'2.5 kVAR', 3.5:'3.5 kVAR', 5:'5 kVAR',
            7.5:'7.5 kVAR', 12.5:'12.5 kVAR', 25:'25 kVAR',
            50:'50 kVAR', 100:'100 kVAR'
        };
        const recommendedStepText = stepLabels[recommendedStep] || `${recommendedStep} kVAR`;

        return {
            kva, shutdownLoadKW: kw,
            noLoadKVA, noLoadKW,
            estimatedNoLoadRequirement,
            recommendedStep, recommendedStepText,
            note: 'Typical rating-band loss assumptions are used because nameplate / test-certificate no-load data are often unavailable.'
        };
    },

    /**
     * Solar PV CT Placement Diagnostic
     * @param {boolean} hasSolar
     * @param {string}  ctLocation
     * @returns {Object}
     */
    getSolarDiagnostic(hasSolar, ctLocation) {
        if (!hasSolar) {
            return {
                status: 'normal', badge: 'Standard System',
                title: 'Standard Utility Installation',
                advice: 'Standard PF correction rules apply. Ensure CT is placed on the main incoming supply phase with correct polarity (P1 facing source, P2 facing load).',
                alertClass: 'bg-blue-50 border-blue-200 text-blue-800'
            };
        }
        switch (ctLocation) {
            case 'upstream':
                return {
                    status: 'optimal', badge: '\u2713 Optimal CT Placement',
                    title: 'CT Located Upstream of Solar Connection',
                    advice: 'CT location is generally aligned with utility-side PF measurement. Verify CT polarity/phase and controller configuration.',
                    alertClass: 'bg-emerald-50 border-emerald-300 text-emerald-800'
                };
            case 'downstream':
                return {
                    status: 'warning', badge: '\u26a0 High Risk Placement',
                    title: 'CT Located Downstream / After Solar Inverter Tap',
                    advice: 'Caution: Check CT measurement philosophy \u2014 controller may not see net utility-side power correctly. Verify against PCC and manufacturer guidance.',
                    alertClass: 'bg-amber-50 border-amber-300 text-amber-800'
                };
            case 'main_incomer':
                return {
                    status: 'optimal', badge: '\u2713 Recommended Setup',
                    title: 'CT at Main Utility Incomer',
                    advice: 'Recommended placement for multi-source sites. Ensure a 4-quadrant PFI controller is used so it does not over-correct during reverse active power export.',
                    alertClass: 'bg-emerald-50 border-emerald-300 text-emerald-800'
                };
            default:
                return {
                    status: 'info', badge: 'Diagnostic Check',
                    title: 'Solar Integration',
                    advice: 'Select a CT location to see diagnostic guidance.',
                    alertClass: 'bg-slate-50 border-slate-200 text-slate-700'
                };
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PFEngine;
}
