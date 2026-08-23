# ⚡ PFI Power Factor & Capacitor Bank Diagnostic App

A modern, high-precision Power Factor & Capacitor Bank Assessment Application recreated directly from the engineering calculation engine of `PF_Correction_Diagnostic_Calculator_Premium_Recreated.xlsx`.

---

## 🌟 Key Features

1. **📊 Electricity Bill Assessment (Core Calculation Engine)**:
   - Input **Active Energy** (Peak & Off-Peak $kWh$) and **Reactive Energy** (Peak & Off-Peak $kVARh$).
   - Computes exact **Current Power Factor** ($PF = \frac{kWh}{\sqrt{kWh^2 + kVARh^2}}$), phase lag angle, and apparent power reduction.
   - Calculates **Required Capacitor Bank Capacity ($kVAR$)** for any desired target PF ($0.80 - 1.00$, default $0.95$).
   - Automatic partition into standard heavy-duty industrial capacitor steps ($100, 50, 25, 12.5\text{ kVAR}$ + fine trim).

2. **⚡ Existing Capacitor Bank Audit**:
   - Inventory counter for existing stage capacities ($100, 50, 25, 12.5, 7.5, 5.0, 3.5, 2.5\text{ kVAR}$).
   - Instant calculation of installed capacity and **Net Deficit / Surplus** compensation required.

3. **🏭 Transformer No-Load Compensation (Shutdown / Idle Mode)**:
   - Enter transformer rating ($kVA$) and shutdown base load ($kW$).
   - Calculates estimated 10% no-load reactive requirement and recommends the optimal fixed capacitor step with ceiling logic.

4. **☀️ Solar PV & PF Controller Diagnostic Check**:
   - Intelligent CT sensor placement advisor (Upstream vs Downstream vs PCC Main Incomer).
   - Prevents controller hunting, leading PF trip-outs, and utility penalties on solar-equipped sites.

5. **📐 Interactive Power Triangle (Vector Visualizer)**:
   - Dynamic real-time Canvas rendering of Real Power ($P$), Initial Reactive Power ($Q_1$), Compensated Reactive Power ($Q_2$), Capacitor Compensation Vector ($Q_c$), and Apparent Powers ($S_1 \to S_2$).

6. **🌐 Bilingual Support**:
   - One-click toggle between **English** and **Urdu (اردو)**.

7. **📄 PDF Report Export**:
   - Generate official engineering audit and diagnostic PDF reports in one click.

---

## 🚀 How to Run the App

### Method 1: Direct in Browser (No installation needed)
1. Simply double-click [`index.html`](file:///c:/Users/HH-Com/Desktop/Power%20factor%20calculator/index.html) to open in Chrome, Edge, Firefox, or Safari.
2. The application works completely offline as well!

### Method 2: Local Web Server (Node.js / npx)
```bash
npx serve .
# or
npx http-server .
```

---

## 🧪 Test Suite & Verification
Run the automated formula consistency test suite:
```bash
node test_calculator.js
```

---

## 📬 Contact & Support
- **PFI Team Email**: `powerfactor@gmail.com`
