const fs = require('fs');

// We will generate a high-resolution SVG of the complete K-Electric Bill with anonymized personal details
// and crystal clear highlighted "Electricity You Have Used" section!

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1200" width="850" height="1200" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
  <defs>
    <style>
      .bold { font-weight: bold; }
      .orange { fill: #F15A24; }
      .navy { fill: #002B49; }
      .dark-slate { fill: #1E293B; }
      .slate { fill: #64748B; }
      .light-slate { fill: #94A3B8; }
      .border-box { stroke: #F15A24; stroke-width: 1.5; fill: #ffffff; rx: 8; }
      .header-box { fill: #FFF4EE; stroke: #FCD3B6; stroke-width: 1; rx: 6; }
      .table-hdr { fill: #FFF0E6; }
      .highlight-row { fill: #EFF6FF; }
      .highlight-reactive { fill: #FFF7ED; }
      .redact-box { fill: #F1F5F9; stroke: #CBD5E1; stroke-dasharray: 2,2; rx: 3; }
      .redact-text { fill: #64748B; font-weight: bold; font-family: monospace; font-size: 11px; }
    </style>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Background Paper -->
  <rect width="850" height="1200" fill="#FFFFFF"/>
  <rect x="15" y="15" width="820" height="1170" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>

  <!-- Top Strip -->
  <rect x="15" y="15" width="820" height="6" fill="#F15A24"/>

  <!-- K-Electric Logo & Header Info -->
  <g transform="translate(35, 35)">
    <!-- KE Wings Logo Graphic -->
    <path d="M 0,35 Q 20,5 35,0 Q 25,25 15,40 Z" fill="#F15A24"/>
    <path d="M 12,38 Q 30,15 45,10 Q 35,32 25,43 Z" fill="#0072CE"/>
    <path d="M 24,40 Q 40,25 55,20 Q 45,38 35,46 Z" fill="#00A651"/>
    <!-- KE Lettering -->
    <text x="50" y="38" font-size="32" font-weight="900" fill="#F15A24" font-family="'Arial Black', sans-serif">KE</text>

    <!-- Scan with banking app box -->
    <rect x="360" y="0" width="80" height="50" fill="#F8FAFC" stroke="#E2E8F0" rx="4"/>
    <rect x="368" y="6" width="38" height="38" fill="#1E293B"/>
    <text x="412" y="22" font-size="7" font-weight="bold" fill="#002B49">Scan with</text>
    <text x="412" y="32" font-size="7" font-weight="bold" fill="#F15A24">Banking App</text>

    <!-- Bill Month & Issue Date -->
    <text x="0" y="62" font-size="10" font-weight="bold" fill="#1E293B">Bill Month: <tspan font-weight="normal">Jul-2026</tspan></text>
    <text x="120" y="62" font-size="10" font-weight="bold" fill="#1E293B">Issue Date: <tspan font-weight="normal">13-Jul-2026</tspan></text>

    <!-- Customer Information Box (Anonymized / Redacted) -->
    <g transform="translate(450, 0)">
      <rect x="0" y="0" width="330" height="68" class="header-box"/>
      <rect x="0" y="0" width="330" height="18" fill="#F15A24" rx="4"/>
      <text x="165" y="13" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Customer Information / صارف کی معلومات</text>
      
      <!-- Redacted Account Information -->
      <text x="10" y="32" font-size="9" fill="#64748B">Contract No:</text>
      <rect x="70" y="23" width="70" height="11" class="redact-box"/>
      <text x="75" y="32" class="redact-text">XXXXXXXX</text>

      <text x="160" y="32" font-size="9" fill="#64748B">Sanc Load:</text>
      <text x="215" y="32" font-size="9" font-weight="bold" fill="#1E293B">655 kW</text>

      <text x="260" y="32" font-size="9" fill="#64748B">Conn Load:</text>
      <text x="310" y="32" font-size="9" font-weight="bold" fill="#1E293B">655</text>

      <text x="10" y="46" font-size="9" fill="#64748B">Consumer No:</text>
      <rect x="70" y="37" width="70" height="11" class="redact-box"/>
      <text x="75" y="46" class="redact-text">BHXXXXXX</text>

      <text x="160" y="46" font-size="9" fill="#64748B">Tariff:</text>
      <text x="215" y="46" font-size="9" font-weight="bold" fill="#002B49">B3 / A2-B</text>

      <text x="260" y="46" font-size="9" fill="#64748B">Meter No:</text>
      <rect x="298" y="37" width="28" height="11" class="redact-box"/>
      <text x="300" y="46" class="redact-text">XXXX</text>

      <text x="10" y="60" font-size="9" fill="#64748B">Invoice No:</text>
      <rect x="70" y="51" width="80" height="11" class="redact-box"/>
      <text x="75" y="60" class="redact-text">4000XXXXXXXX</text>

      <text x="160" y="60" font-size="9" fill="#64748B">Customer Type:</text>
      <text x="230" y="60" font-size="9" font-weight="bold" fill="#1E293B">REGULAR</text>
    </g>

    <!-- Consumer Name and Address (Redacted with ABC) -->
    <g transform="translate(0, 75)">
      <rect x="0" y="0" width="440" height="34" fill="#F8FAFC" stroke="#E2E8F0" rx="4"/>
      <text x="8" y="14" font-size="11" font-weight="bold" fill="#002B49">NAME: <tspan fill="#64748B" font-family="monospace">ABC COMMERCIAL / INDUSTRIAL CONSUMER</tspan></text>
      <text x="8" y="27" font-size="9" fill="#64748B">ADDRESS: <tspan font-family="monospace">PLOT # ABC, SECTOR XX, INDUSTRIAL AREA, KARACHI</tspan></text>
      
      <text x="460" y="14" font-size="9" fill="#64748B">KE NTN No: <tspan font-weight="bold" fill="#1E293B">1543137-1</tspan></text>
      <text x="620" y="14" font-size="9" fill="#64748B">KE GST No: <tspan font-weight="bold" fill="#1E293B">12-00-2716-007-28</tspan></text>
      <text x="460" y="27" font-size="9" fill="#64748B">Account No: <tspan font-weight="bold" font-family="monospace" fill="#002B49">04000XXXXXXXX</tspan></text>
      <text x="620" y="27" font-size="9" fill="#64748B">CNIC/NTN: <tspan font-weight="bold" font-family="monospace" fill="#64748B">XXXXXXX-X</tspan></text>
    </g>
  </g>

  <!-- 4 Summary Banner Boxes -->
  <g transform="translate(35, 155)">
    <!-- Box 1: Amount Due -->
    <g transform="translate(0, 0)">
      <rect width="185" height="78" fill="#FFF9F5" stroke="#F15A24" stroke-width="1.5" rx="6"/>
      <text x="12" y="20" font-size="11" font-weight="bold" fill="#F15A24">Amount Due / واجب الادا رقم</text>
      <text x="12" y="46" font-size="18" font-weight="900" fill="#002B49" font-family="'JetBrains Mono', monospace">Rs. 25,092,527</text>
      <text x="12" y="64" font-size="8" fill="#64748B">Till Due Date 27-Jul-2026</text>
    </g>

    <!-- Box 2: Current Month Units -->
    <g transform="translate(195, 0)">
      <rect width="185" height="78" fill="#FFF9F5" stroke="#F15A24" stroke-width="1.5" rx="6"/>
      <text x="12" y="20" font-size="11" font-weight="bold" fill="#F15A24">Current Month / موجودہ مہینہ</text>
      <text x="12" y="46" font-size="16" font-weight="900" fill="#002B49" font-family="'JetBrains Mono', monospace">383,893 units</text>
      <text x="12" y="64" font-size="8" fill="#64748B">= Rs. 25,092,527.37</text>
    </g>

    <!-- Box 3: Previous Dues -->
    <g transform="translate(390, 0)">
      <rect width="185" height="78" fill="#FFF9F5" stroke="#F15A24" stroke-width="1.5" rx="6"/>
      <text x="12" y="20" font-size="11" font-weight="bold" fill="#F15A24">Previous Dues / گزشتہ بقایا جات</text>
      <text x="12" y="46" font-size="18" font-weight="900" fill="#002B49" font-family="'JetBrains Mono', monospace">Rs. -0.62</text>
      <text x="12" y="64" font-size="8" fill="#64748B">Remaining Dues: Rs. -0.62</text>
    </g>

    <!-- Box 4: Due Date -->
    <g transform="translate(585, 0)">
      <rect width="195" height="78" fill="#FFF9F5" stroke="#F15A24" stroke-width="1.5" rx="6"/>
      <text x="12" y="20" font-size="11" font-weight="bold" fill="#F15A24">Due Date / مقررہ تاریخ</text>
      <text x="12" y="46" font-size="18" font-weight="900" fill="#F15A24" font-family="'JetBrains Mono', monospace">27th Jul 2026</text>
      <text x="12" y="64" font-size="8" fill="#64748B">Pay within due date &amp; save LPS</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- CRITICAL SECTION: "ELECTRICITY YOU HAVE USED" (HIGH IMPACT HIGHLIGHTED) -->
  <!-- ========================================================================= -->
  <g transform="translate(35, 245)">
    
    <!-- Outer Glow / Highlight Border -->
    <rect x="-6" y="-6" width="392" height="202" fill="none" stroke="#F15A24" stroke-width="3" stroke-dasharray="6,4" rx="10"/>
    <rect x="0" y="0" width="380" height="190" fill="#FFFFFF" stroke="#F15A24" stroke-width="1.5" rx="8" filter="url(#shadow)"/>
    
    <!-- Header banner -->
    <rect x="0" y="0" width="380" height="28" fill="#F15A24" rx="6"/>
    <text x="190" y="19" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      ⚡ Electricity You Have Used / آپ کی استعمال شدہ بجلی
    </text>

    <!-- Callout Tag -->
    <rect x="235" y="-14" width="140" height="18" fill="#002B49" rx="4"/>
    <text x="305" y="-1" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">👇 COPY VALUES FROM HERE</text>

    <!-- Table Header -->
    <g transform="translate(8, 36)">
      <rect x="0" y="0" width="364" height="20" fill="#FFF4EE" stroke="#FCD3B6" stroke-width="0.5" rx="3"/>
      <text x="6" y="14" font-size="9" font-weight="bold" fill="#002B49">Description</text>
      <text x="125" y="14" font-size="8" fill="#64748B">Prev Reading</text>
      <text x="190" y="14" font-size="8" fill="#64748B">Curr Reading</text>
      
      <!-- Units Column Header Highlighted -->
      <rect x="250" y="0" width="75" height="20" fill="#F15A24" rx="3"/>
      <text x="287" y="14" font-size="9" font-weight="extrabold" fill="#FFFFFF" text-anchor="middle">Units 👈</text>
      
      <text x="335" y="14" font-size="8" fill="#64748B">MDI (kW)</text>
    </g>

    <!-- Row 1: Energy - Off Peak -->
    <g transform="translate(8, 62)">
      <rect x="0" y="0" width="364" height="26" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="0.5" rx="3"/>
      <circle cx="10" cy="13" r="4" fill="#2563eb"/>
      <text x="20" y="16" font-size="10" font-weight="bold" fill="#1E293B">Energy - Off Peak</text>
      <text x="125" y="16" font-size="8" fill="#94A3B8" font-family="monospace">9040062.9</text>
      <text x="190" y="16" font-size="8" fill="#94A3B8" font-family="monospace">9365566.4</text>
      
      <!-- Value Pill -->
      <rect x="250" y="2" width="75" height="22" fill="#2563eb" rx="4"/>
      <text x="287" y="17" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="monospace">325,503.5</text>
      <text x="335" y="16" font-size="8" fill="#64748B">1001.8</text>
    </g>

    <!-- Row 2: Energy - Peak -->
    <g transform="translate(8, 92)">
      <rect x="0" y="0" width="364" height="26" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="0.5" rx="3"/>
      <circle cx="10" cy="13" r="4" fill="#2563eb"/>
      <text x="20" y="16" font-size="10" font-weight="bold" fill="#1E293B">Energy - Peak</text>
      <text x="125" y="16" font-size="8" fill="#94A3B8" font-family="monospace">1727595.8</text>
      <text x="190" y="16" font-size="8" fill="#94A3B8" font-family="monospace">1785983.9</text>
      
      <!-- Value Pill -->
      <rect x="250" y="2" width="75" height="22" fill="#2563eb" rx="4"/>
      <text x="287" y="17" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="monospace">58,388.1</text>
      <text x="335" y="16" font-size="8" fill="#64748B">766.3</text>
    </g>

    <!-- Row 3: Reactive Energy Off Peak -->
    <g transform="translate(8, 122)">
      <rect x="0" y="0" width="364" height="26" fill="#FFF7ED" stroke="#FED7AA" stroke-width="0.5" rx="3"/>
      <circle cx="10" cy="13" r="4" fill="#F15A24"/>
      <text x="20" y="16" font-size="10" font-weight="bold" fill="#1E293B">Reactive Energy Off Peak</text>
      <text x="125" y="16" font-size="8" fill="#94A3B8" font-family="monospace">158236.5</text>
      <text x="190" y="16" font-size="8" fill="#94A3B8" font-family="monospace">208709.8</text>
      
      <!-- Value Pill -->
      <rect x="250" y="2" width="75" height="22" fill="#F15A24" rx="4"/>
      <text x="287" y="17" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="monospace">50,473.4</text>
      <text x="335" y="16" font-size="8" fill="#94A3B8">-</text>
    </g>

    <!-- Row 4: Reactive Energy On Peak -->
    <g transform="translate(8, 152)">
      <rect x="0" y="0" width="364" height="26" fill="#FFF7ED" stroke="#FED7AA" stroke-width="0.5" rx="3"/>
      <circle cx="10" cy="13" r="4" fill="#F15A24"/>
      <text x="20" y="16" font-size="10" font-weight="bold" fill="#1E293B">Reactive Energy On Peak</text>
      <text x="125" y="16" font-size="8" fill="#94A3B8" font-family="monospace">17045.7</text>
      <text x="190" y="16" font-size="8" fill="#94A3B8" font-family="monospace">24252.5</text>
      
      <!-- Value Pill -->
      <rect x="250" y="2" width="75" height="22" fill="#F15A24" rx="4"/>
      <text x="287" y="17" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="monospace">7,206.8</text>
      <text x="335" y="16" font-size="8" fill="#94A3B8">-</text>
    </g>

  </g>

  <!-- Right Section: Bill Calculation Breakdown Table -->
  <g transform="translate(435, 245)">
    <rect x="0" y="0" width="380" height="495" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" rx="8"/>
    <rect x="0" y="0" width="380" height="28" fill="#002B49" rx="6"/>
    <text x="190" y="19" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      Bill Calculation / آپ کے موجودہ بل کا حساب
    </text>

    <g transform="translate(10, 36)">
      <text x="0" y="12" font-size="9" fill="#64748B">Reading Date: <tspan font-weight="bold" fill="#1E293B">09-Jul-26</tspan></text>
      <text x="140" y="12" font-size="9" fill="#64748B">No. of Month(s): <tspan font-weight="bold" fill="#1E293B">1</tspan></text>
      <text x="240" y="12" font-size="9" fill="#64748B">Bill Mode: <tspan font-weight="bold" fill="#1E293B">NORM</tspan></text>

      <!-- Tariff charges table -->
      <line x1="0" y1="20" x2="360" y2="20" stroke="#E2E8F0"/>
      
      <text x="0" y="34" font-size="9" font-weight="bold" fill="#002B49">Items</text>
      <text x="170" y="34" font-size="9" font-weight="bold" fill="#002B49" text-anchor="end">Units</text>
      <text x="250" y="34" font-size="9" font-weight="bold" fill="#002B49" text-anchor="end">Rate</text>
      <text x="360" y="34" font-size="9" font-weight="bold" fill="#002B49" text-anchor="end">Amount (Rs.)</text>
      
      <line x1="0" y1="40" x2="360" y2="40" stroke="#CBD5E1"/>

      <!-- Item rows -->
      <g transform="translate(0, 54)" font-size="9">
        <text x="0" y="0" fill="#1E293B">Fixed Charges</text>
        <text x="170" y="0" fill="#64748B" text-anchor="end">1001.87</text>
        <text x="250" y="0" fill="#64748B" text-anchor="end">1250.00</text>
        <text x="360" y="0" font-weight="bold" fill="#1E293B" text-anchor="end">1,252,340.00</text>

        <text x="0" y="16" fill="#1E293B">Variable Off Peak</text>
        <text x="170" y="16" fill="#64748B" text-anchor="end">325503.50</text>
        <text x="250" y="16" fill="#64748B" text-anchor="end">35.1500</text>
        <text x="360" y="16" font-weight="bold" fill="#1E293B" text-anchor="end">11,441,448.03</text>

        <text x="0" y="32" fill="#1E293B">Variable Peak</text>
        <text x="170" y="32" fill="#64748B" text-anchor="end">58388.11</text>
        <text x="250" y="32" fill="#64748B" text-anchor="end">43.8200</text>
        <text x="360" y="32" font-weight="bold" fill="#1E293B" text-anchor="end">2,558,567.16</text>

        <text x="0" y="48" fill="#1E293B">Uniform Quarterly Adjustment</text>
        <text x="170" y="48" fill="#64748B" text-anchor="end">383891.61</text>
        <text x="250" y="48" fill="#64748B" text-anchor="end">-1.9857</text>
        <text x="360" y="48" fill="#1E293B" text-anchor="end">-762,293.58</text>

        <text x="0" y="64" fill="#1E293B">FCA :May-26</text>
        <text x="170" y="64" fill="#64748B" text-anchor="end">286301.25</text>
        <text x="250" y="64" fill="#64748B" text-anchor="end">0.3364</text>
        <text x="360" y="64" fill="#1E293B" text-anchor="end">96,311.74</text>

        <text x="0" y="80" fill="#1E293B">Additional Surcharge (PHL)</text>
        <text x="170" y="80" fill="#64748B" text-anchor="end">383891.61</text>
        <text x="250" y="80" fill="#64748B" text-anchor="end">3.2300</text>
        <text x="360" y="80" fill="#1E293B" text-anchor="end">1,239,969.92</text>

        <!-- Subtotal Electricity Charges -->
        <line x1="0" y1="90" x2="360" y2="90" stroke="#CBD5E1"/>
        <text x="0" y="104" font-weight="bold" fill="#002B49">Electricity Charges</text>
        <text x="360" y="104" font-weight="900" fill="#002B49" text-anchor="end">Rs. 15,826,343.27</text>

        <!-- Taxes and Duties -->
        <text x="0" y="122" fill="#64748B">Electricity Duty</text>
        <text x="360" y="122" fill="#64748B" text-anchor="end">291,480.07</text>

        <text x="0" y="136" fill="#64748B">Sales Tax u/s 3(1)*</text>
        <text x="360" y="136" fill="#64748B" text-anchor="end">2,901,208.20</text>

        <text x="0" y="150" fill="#64748B">Further Tax u/s 3(1A)*</text>
        <text x="360" y="150" fill="#64748B" text-anchor="end">644,712.93</text>

        <text x="0" y="164" fill="#64748B">Extra Tax u/s 3(5)* / SRO 1222</text>
        <text x="360" y="164" fill="#64748B" text-anchor="end">2,740,029.97</text>

        <text x="0" y="178" fill="#64748B">Income Tax U/S 235**</text>
        <text x="360" y="178" fill="#64748B" text-anchor="end">2,688,002.93</text>

        <line x1="0" y1="188" x2="360" y2="188" stroke="#CBD5E1"/>
        <text x="0" y="202" font-weight="bold" fill="#F15A24">Total Taxes &amp; Duties</text>
        <text x="360" y="202" font-weight="bold" fill="#F15A24" text-anchor="end">Rs. 9,266,184.10</text>

        <!-- Total Bill -->
        <rect x="0" y="215" width="360" height="32" fill="#002B49" rx="4"/>
        <text x="10" y="235" font-size="11" font-weight="bold" fill="#FFFFFF">Total Payable Within Due Date</text>
        <text x="350" y="235" font-size="13" font-weight="900" fill="#F15A24" text-anchor="end" font-family="monospace">Rs. 25,092,527</text>
      </g>
    </g>
  </g>

  <!-- Bottom Left: 13 Month Usage History Mockup -->
  <g transform="translate(35, 450)">
    <rect x="0" y="0" width="380" height="135" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" rx="8"/>
    <rect x="0" y="0" width="380" height="24" fill="#FFF4EE" stroke="#FCD3B6" stroke-width="0.5" rx="6"/>
    <text x="12" y="16" font-size="10" font-weight="bold" fill="#F15A24">13 Month Usage History / 13 مہینے کے استعمال کی تفصیل</text>
    
    <!-- Mini histogram bars -->
    <g transform="translate(20, 110)">
      <rect x="0" y="-30" width="16" height="30" fill="#94A3B8"/>
      <rect x="25" y="-55" width="16" height="55" fill="#94A3B8"/>
      <rect x="50" y="-48" width="16" height="48" fill="#94A3B8"/>
      <rect x="75" y="-42" width="16" height="42" fill="#94A3B8"/>
      <rect x="100" y="-38" width="16" height="38" fill="#94A3B8"/>
      <rect x="125" y="-28" width="16" height="28" fill="#94A3B8"/>
      <rect x="150" y="-22" width="16" height="22" fill="#94A3B8"/>
      <rect x="175" y="-20" width="16" height="20" fill="#94A3B8"/>
      <rect x="200" y="-25" width="16" height="25" fill="#94A3B8"/>
      <rect x="225" y="-32" width="16" height="32" fill="#94A3B8"/>
      <rect x="250" y="-48" width="16" height="48" fill="#94A3B8"/>
      <rect x="275" y="-62" width="16" height="62" fill="#94A3B8"/>
      <rect x="300" y="-68" width="16" height="68" fill="#002B49"/>
      <text x="308" y="12" font-size="8" font-weight="bold" fill="#002B49" text-anchor="middle">Jul-26</text>
    </g>
  </g>

  <!-- Bottom Left: Billing & Payment History -->
  <g transform="translate(35, 595)">
    <rect x="0" y="0" width="380" height="145" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" rx="8"/>
    <rect x="0" y="0" width="380" height="24" fill="#FFF4EE" stroke="#FCD3B6" stroke-width="0.5" rx="6"/>
    <text x="12" y="16" font-size="10" font-weight="bold" fill="#F15A24">Billing &amp; Payment History / بلنگ اور ادائیگی کی تفصیل</text>
    
    <g transform="translate(15, 40)" font-size="9">
      <text x="0" y="0" font-weight="bold" fill="#002B49">MM/YY</text>
      <text x="80" y="0" font-weight="bold" fill="#002B49">Billed Amount</text>
      <text x="180" y="0" font-weight="bold" fill="#002B49">Pay-Date</text>
      <text x="270" y="0" font-weight="bold" fill="#002B49">Payment</text>
      <line x1="0" y1="8" x2="350" y2="8" stroke="#E2E8F0"/>
      
      <text x="0" y="24" fill="#1E293B">06/26</text>
      <text x="80" y="24" fill="#1E293B">Rs. 25,098,394.72</text>
      <text x="180" y="24" fill="#64748B">22-Jun-26</text>
      <text x="270" y="24" font-weight="bold" fill="#00A651">Rs. 25,098,395</text>

      <text x="0" y="44" fill="#1E293B">05/26</text>
      <text x="80" y="44" fill="#1E293B">Rs. 19,837,456.96</text>
      <text x="180" y="44" fill="#64748B">25-May-26</text>
      <text x="270" y="44" font-weight="bold" fill="#00A651">Rs. 19,837,457</text>

      <text x="0" y="64" fill="#1E293B">04/26</text>
      <text x="80" y="64" fill="#1E293B">Rs. 13,504,773.33</text>
      <text x="180" y="64" fill="#64748B">17-Apr-26</text>
      <text x="270" y="64" font-weight="bold" fill="#00A651">Rs. 13,504,773</text>
    </g>
  </g>

  <!-- Message Board Box -->
  <g transform="translate(35, 750)">
    <rect x="0" y="0" width="780" height="70" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" rx="8"/>
    <rect x="0" y="0" width="780" height="22" fill="#FFF4EE" stroke="#FCD3B6" stroke-width="0.5" rx="6"/>
    <text x="12" y="15" font-size="10" font-weight="bold" fill="#F15A24">Message Board / میسج بورڈ</text>
    <text x="15" y="42" font-size="9" fill="#1E293B">FCA of XWDISCOs is also being charged to KE consumers as part of Uniform FCA starting from the month of Jun 25.</text>
    <text x="15" y="56" font-size="9" font-weight="bold" fill="#002B49">Power Quality Advisory: Maintain Monthly Average Power Factor above 0.90 to avoid low PF penalty charges.</text>
  </g>

  <!-- Bottom Bank Tear-Off Slip (Redacted) -->
  <g transform="translate(35, 835)">
    <line x1="0" y1="0" x2="780" y2="0" stroke="#94A3B8" stroke-dasharray="4,4"/>
    <text x="390" y="-4" font-size="8" fill="#94A3B8" text-anchor="middle">✂ Bank Tear-off Slip</text>
    
    <g transform="translate(0, 15)">
      <text x="0" y="16" font-size="12" font-weight="bold" fill="#002B49">Customer Name: <tspan fill="#64748B" font-family="monospace">ABC COMMERCIAL CONSUMER</tspan></text>
      <text x="0" y="34" font-size="11" font-weight="bold" fill="#002B49">Account Number: <tspan fill="#64748B" font-family="monospace">04000XXXXXXXX</tspan></text>
      <text x="0" y="52" font-size="11" font-weight="bold" fill="#002B49">Contract Number: <tspan fill="#64748B" font-family="monospace">XXXXXXXX</tspan></text>

      <text x="450" y="16" font-size="11" font-weight="bold" fill="#64748B">Invoice Number: <tspan font-family="monospace" fill="#002B49">4000XXXXXXXX</tspan></text>
      <text x="650" y="16" font-size="11" font-weight="bold" fill="#64748B">Due Date: <tspan fill="#F15A24">27-Jul-2026</tspan></text>
      
      <rect x="450" y="28" width="330" height="34" fill="#F8FAFC" stroke="#E2E8F0" rx="4"/>
      <text x="460" y="50" font-size="14" font-weight="900" fill="#002B49" font-family="monospace">Rs. 25,092,527</text>
      <text x="620" y="50" font-size="9" fill="#64748B">Bank Clearance Stamp</text>
    </g>
  </g>

</svg>`;

fs.writeFileSync('KE_Bill_Reference_Anonymized.svg', svgContent);
console.log('Saved KE_Bill_Reference_Anonymized.svg successfully!');
