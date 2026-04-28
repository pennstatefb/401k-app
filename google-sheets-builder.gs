// ══════════════════════════════════════════════════════════════
//  THE 7-YEAR RUNWAY — Google Sheets Dashboard Builder
//
//  HOW TO USE (TWO STEPS — Google limits scripts to 6 minutes):
//  1. Open a new Google Sheet
//  2. Extensions → Apps Script
//  3. Delete existing code, paste this entire file, Save
//  4. Select  buildStep1  in the dropdown → Run  (wait ~3 min)
//  5. Select  buildStep2  in the dropdown → Run  (wait ~3 min)
//  6. Done — all 9 tabs are ready
// ══════════════════════════════════════════════════════════════

function getColors() {
  return {
    navy:      '#1e3a5f',
    blue:      '#2563eb',
    lightBlue: '#dbeafe',
    yellow:    '#fef9c3',
    green:     '#dcfce7',
    greenText: '#15803d',
    red:       '#fee2e2',
    redText:   '#dc2626',
    amber:     '#fef3c7',
    amberText: '#d97706',
    white:     '#ffffff',
    offWhite:  '#f8fafc',
    gray:      '#f1f5f9',
    darkGray:  '#6b7280',
    border:    '#e2e8f0',
  };
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setName('The 7-Year Runway — Retirement Dashboard');
  const TABS = ['START HERE','DASHBOARD','SNAPSHOT','BALANCES','GOLDILOCKS','RMD','SS_OPT','WITHDRAWAL','CATCHUP','MEDICARE'];
  const existing = ss.getSheets().map(s => s.getName());
  TABS.forEach(name => { if (!existing.includes(name)) ss.insertSheet(name); });
  const sh = {};
  TABS.forEach(name => {
    sh[name] = ss.getSheetByName(name);
    sh[name].clear();
    sh[name].clearFormats();
    sh[name].clearConditionalFormatRules();
  });
  TABS.forEach((name, i) => { ss.setActiveSheet(sh[name]); ss.moveActiveSheet(i + 1); });
  ss.getSheets().forEach(s => { if (!TABS.includes(s.getName())) ss.deleteSheet(s); });
  return { ss, sh };
}

// ── STEP 1: START HERE + SNAPSHOT + BALANCES + GOLDILOCKS + RMD ─
function buildStep1() {
  const { ss, sh } = setupSheets();
  const C = getColors();
  buildStartHere(sh['START HERE'], C); SpreadsheetApp.flush();
  buildSnapshot(sh['SNAPSHOT'], C);    SpreadsheetApp.flush();
  buildBalances(sh['BALANCES'], C);    SpreadsheetApp.flush();
  buildGoldilocks(sh['GOLDILOCKS'], C); SpreadsheetApp.flush();
  buildRMD(sh['RMD'], C);
  SpreadsheetApp.flush();
  ss.setActiveSheet(sh['START HERE']);
  SpreadsheetApp.getUi().alert('✅  Step 1 done!\n\nNow select buildStep2 in the dropdown and run it.\n\nStart on the START HERE tab when complete.');
}

// ── STEP 2: SS_OPT + WITHDRAWAL + CATCHUP + MEDICARE + DASHBOARD
function buildStep2() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const C = getColors();
  const sh = {};
  ['SS_OPT','WITHDRAWAL','CATCHUP','MEDICARE','DASHBOARD'].forEach(name => {
    sh[name] = ss.getSheetByName(name);
    if (sh[name]) {
      sh[name].clear();
      sh[name].clearFormats();
      sh[name].clearConditionalFormatRules();
    }
  });
  buildSS(sh['SS_OPT'], C);             SpreadsheetApp.flush();
  buildWithdrawal(sh['WITHDRAWAL'], C); SpreadsheetApp.flush();
  buildCatchUp(sh['CATCHUP'], C);       SpreadsheetApp.flush();
  buildMedicare(sh['MEDICARE'], C);     SpreadsheetApp.flush();
  buildDashboardTab(sh['DASHBOARD'], C);
  SpreadsheetApp.flush();
  ss.setActiveSheet(sh['DASHBOARD']);
  SpreadsheetApp.getUi().alert(
    '✅  Your 7-Year Runway is ready!\n\n' +
    'Open the START HERE tab for a setup checklist and guide.\n\n' +
    'Then go to SNAPSHOT → fill in the yellow cells.\n' +
    'Then go to BALANCES → enter your account values.\n' +
    'Everything else calculates automatically.\n\n' +
    'Yellow = your inputs.  White = calculated.'
  );
}

// ══════════════════════════════════════════════════════════════
// START HERE TAB
// ══════════════════════════════════════════════════════════════

function buildStartHere(sh, C) {
  sh.setColumnWidth(1, 28);   // narrow left margin
  sh.setColumnWidth(2, 260);  // label / content
  sh.setColumnWidth(3, 420);  // detail
  sh.setColumnWidth(4, 28);   // right margin
  sh.setRowHeight(1, 16);

  let r = 2;

  // ── Hero banner ──────────────────────────────────────────────
  sh.getRange(r, 2, 1, 2).merge()
    .setValue('🏁  The 7-Year Runway')
    .setBackground(C.navy)
    .setFontColor(C.white)
    .setFontSize(22)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center');
  sh.setRowHeight(r, 52); r++;

  sh.getRange(r, 2, 1, 2).merge()
    .setValue('Your complete retirement planning dashboard — for ages 55 to 62')
    .setBackground(C.blue)
    .setFontColor(C.white)
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sh.setRowHeight(r, 28); r++;
  r++; // spacer

  // ── Quick-Start checklist ────────────────────────────────────
  sh.getRange(r, 2, 1, 2).merge()
    .setValue('QUICK-START CHECKLIST')
    .setBackground(C.gray)
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontColor(C.darkGray)
    .setHorizontalAlignment('left');
  sh.setRowHeight(r, 22); r++;

  const steps = [
    ['☐  Step 1', 'Go to SNAPSHOT — enter your age, retirement age, take-home pay, and monthly retirement expenses.'],
    ['☐  Step 2', 'Go to BALANCES — enter your current 401(k), IRA, and brokerage balances. Add a spouse if applicable.'],
    ['☐  Step 3', 'Check DASHBOARD — review your projected balance, tax-bucket split, and top action items.'],
    ['☐  Step 4', 'Open GOLDILOCKS — find your ideal annual Roth conversion amount to reduce future taxes.'],
    ['☐  Step 5', 'Open SS_OPT — see whether claiming Social Security at 62, 67, or 70 is best for you.'],
    ['☐  Step 6', 'Review WITHDRAWAL — map out which account to draw from first in retirement.'],
    ['☐  Step 7', 'Check CATCHUP — confirm you are maximizing 2025 IRS contribution limits.'],
    ['☐  Step 8', 'Review MEDICARE — estimate your Part B / IRMAA costs and healthcare gap.'],
    ['☐  Step 9', 'Check RMD — see when Required Minimum Distributions start and how large they will be.'],
  ];
  steps.forEach(([label, detail]) => {
    sh.getRange(r, 2).setValue(label).setFontWeight('bold').setFontSize(10).setVerticalAlignment('top');
    sh.getRange(r, 3).setValue(detail).setFontSize(10).setWrap(true).setVerticalAlignment('top').setFontColor('#374151');
    sh.setRowHeight(r, 32); r++;
  });
  r++; // spacer

  // ── Color legend ─────────────────────────────────────────────
  sh.getRange(r, 2, 1, 2).merge()
    .setValue('COLOR GUIDE')
    .setBackground(C.gray)
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontColor(C.darkGray);
  sh.setRowHeight(r, 22); r++;

  const legend = [
    [C.yellow,  '#000000', '🟡  Yellow cells',  'Your inputs — type directly into these cells.'],
    [C.white,   '#374151', '⬜  White cells',   'Calculated automatically — do not edit.'],
    [C.green,   C.greenText, '🟢  Green',        'On track — your projected income meets your target.'],
    [C.amber,   C.amberText, '🟠  Yellow/Amber', 'Close — minor adjustments recommended.'],
    [C.red,     C.redText,   '🔴  Red',          'Gap detected — review your contributions and timeline.'],
  ];
  legend.forEach(([bg, fg, label, detail]) => {
    sh.getRange(r, 2).setValue(label).setBackground(bg).setFontColor(fg).setFontWeight('bold').setFontSize(10);
    sh.getRange(r, 3).setValue(detail).setFontSize(10).setFontColor('#374151').setWrap(true);
    sh.setRowHeight(r, 26); r++;
  });
  r++; // spacer

  // ── Tab reference ─────────────────────────────────────────────
  sh.getRange(r, 2, 1, 2).merge()
    .setValue('WHAT EACH TAB DOES')
    .setBackground(C.gray)
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontColor(C.darkGray);
  sh.setRowHeight(r, 22); r++;

  const tabs = [
    ['SNAPSHOT',   'Your age, retirement target, income, and "Am I on track?" status at a glance.'],
    ['BALANCES',   'Enter every account balance — 401(k), IRA, Roth, brokerage, HSA, pension, Social Security.'],
    ['DASHBOARD',  'Charts showing your tax-bucket split and projected portfolio at retirement, plus top action items.'],
    ['GOLDILOCKS', 'Roth Conversion Ladder — find the sweet-spot annual conversion to stay in your current bracket.'],
    ['RMD',        'Required Minimum Distribution projector — see what the IRS will force you to withdraw at age 73+.'],
    ['SS_OPT',     'Social Security optimizer — compare claiming at 62, 67, or 70 and find your breakeven age.'],
    ['WITHDRAWAL', 'Withdrawal strategy — which accounts to draw first to minimize taxes in retirement.'],
    ['CATCHUP',    '2025 IRS contribution limits tracker — 401(k) and IRA progress bars + employer match check.'],
    ['MEDICARE',   'Part B premium estimator with IRMAA surcharge tiers based on your income.'],
  ];
  tabs.forEach(([tab, desc]) => {
    sh.getRange(r, 2).setValue(tab).setFontWeight('bold').setFontSize(10)
      .setBackground(C.lightBlue).setFontColor(C.navy);
    sh.getRange(r, 3).setValue(desc).setFontSize(10).setFontColor('#374151').setWrap(true);
    sh.setRowHeight(r, 28); r++;
  });
  r++; // spacer

  // ── Disclaimer ───────────────────────────────────────────────
  sh.getRange(r, 2, 1, 2).merge()
    .setValue('⚠️  This spreadsheet is for educational and planning purposes only. It is not financial, tax, or legal advice. Consult a qualified financial advisor before making retirement decisions.')
    .setFontSize(9)
    .setFontColor(C.darkGray)
    .setFontStyle('italic')
    .setWrap(true)
    .setHorizontalAlignment('left');
  sh.setRowHeight(r, 40); r++;

  // ── Lock everything (no yellow input cells on this tab) ───────
  lockFormulas(sh, []);
}

// ══════════════════════════════════════════════════════════════
// SHARED HELPERS
// ══════════════════════════════════════════════════════════════

function titleRow(sh, row, text, sub, C, cols) {
  const n = cols || 6;
  sh.getRange(row, 1, 1, n).merge()
    .setValue(text)
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(row, 40);
  if (sub) {
    sh.getRange(row + 1, 1, 1, n).merge()
      .setValue(sub)
      .setBackground(C.lightBlue).setFontColor(C.navy)
      .setFontSize(9).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sh.setRowHeight(row + 1, 20);
  }
}

function sectionHdr(sh, row, text, C, cols) {
  sh.getRange(row, 1, 1, cols || 6).merge()
    .setValue('  ' + text)
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(10)
    .setVerticalAlignment('middle');
  sh.setRowHeight(row, 26);
}

function inpRow(sh, row, label, val, fmt, C) {
  sh.getRange(row, 1).setValue(label).setFontColor('#374151').setFontSize(10);
  const c = sh.getRange(row, 2);
  c.setValue(val).setBackground(C.yellow).setFontWeight('bold').setFontSize(10);
  if (fmt) c.setNumberFormat(fmt);
  sh.setRowHeight(row, 22);
  return c;
}

function calcRow(sh, row, label, formula, fmt, C) {
  sh.getRange(row, 1).setValue(label).setFontColor('#374151').setFontSize(10);
  const c = sh.getRange(row, 2);
  c.setFormula(formula).setBackground(C.offWhite).setFontWeight('bold').setFontSize(10);
  if (fmt) c.setNumberFormat(fmt);
  sh.setRowHeight(row, 22);
  return c;
}

function tblHeader(sh, row, headers, C) {
  const n = headers.length;
  const rng = sh.getRange(row, 1, 1, n);
  rng.setValues([headers]);
  rng.setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(9)
    .setHorizontalAlignment('center').setWrap(true);
  sh.setRowHeight(row, 28);
}

// Protect formula cells with a warning; yellow input cells remain freely editable
function lockFormulas(sh, yellowA1s) {
  const protection = sh.protect().setDescription('Edit yellow cells only — other cells contain formulas');
  if (yellowA1s.length > 0) {
    protection.setUnprotectedRanges(yellowA1s.map(a1 => sh.getRange(a1)));
  }
  protection.setWarningOnly(true);
}

// Incremental tax formula — returns formula string for the tax owed on a Roth conversion
// taxableIncome = cell ref string (e.g. "E29"), conversionAmt = cell ref string (e.g. "F29")
// filingStatusRef = absolute cell ref (e.g. "$B$6")
function taxFormula(ti, ca, fs) {
  const mfj = `(MIN(${ti}+${ca},23850)*0.10+MAX(0,MIN(${ti}+${ca},96950)-23850)*0.12+MAX(0,MIN(${ti}+${ca},206700)-96950)*0.22+MAX(0,MIN(${ti}+${ca},394600)-206700)*0.24+MAX(0,MIN(${ti}+${ca},501050)-394600)*0.32+MAX(0,${ti}+${ca}-501050)*0.35)-(MIN(${ti},23850)*0.10+MAX(0,MIN(${ti},96950)-23850)*0.12+MAX(0,MIN(${ti},206700)-96950)*0.22+MAX(0,MIN(${ti},394600)-206700)*0.24+MAX(0,MIN(${ti},501050)-394600)*0.32+MAX(0,${ti}-501050)*0.35)`;
  const single = `(MIN(${ti}+${ca},11925)*0.10+MAX(0,MIN(${ti}+${ca},48475)-11925)*0.12+MAX(0,MIN(${ti}+${ca},103350)-48475)*0.22+MAX(0,MIN(${ti}+${ca},197300)-103350)*0.24+MAX(0,MIN(${ti}+${ca},250525)-197300)*0.32+MAX(0,${ti}+${ca}-250525)*0.35)-(MIN(${ti},11925)*0.10+MAX(0,MIN(${ti},48475)-11925)*0.12+MAX(0,MIN(${ti},103350)-48475)*0.22+MAX(0,MIN(${ti},197300)-103350)*0.24+MAX(0,MIN(${ti},250525)-197300)*0.32+MAX(0,${ti}-250525)*0.35)`;
  return `=IF(${fs}="Married Filing Jointly",${mfj},${single})`;
}

// ══════════════════════════════════════════════════════════════
// TAB: SNAPSHOT
// Row map:
//   4=CurrentAge, 5=SpouseAge, 6=RetireAge, 7=FilingStatus
//   10=TakeHome, 11=GrossIncome, 12=401kContrib, 13=RetireExpenses
//   16=ExpectedReturn, 17=InflationRate
//   20=YearsToRetire, 21=RetireYear, 22=Portfolio, 23=ProjPortfolio
//   24=MonthlyIncome, 25=IncomeNeeded, 26=Surplus, 27=SavingsGap
//   29=OnTrackIndicator
// ══════════════════════════════════════════════════════════════
function buildSnapshot(sh, C) {
  sh.setColumnWidth(1, 270); sh.setColumnWidth(2, 190);
  sh.setColumnWidth(3, 20);  sh.setColumnWidth(4, 200);

  titleRow(sh, 1, 'YOUR SNAPSHOT', 'Fill in yellow cells — everything else calculates automatically.', C, 4);

  sectionHdr(sh, 3, 'ABOUT YOU', C, 4);
  inpRow(sh, 4,  'Current Age', 55, '0', C);
  inpRow(sh, 5,  'Spouse Age (0 if none)', 53, '0', C);
  inpRow(sh, 6,  'Target Retirement Age', 62, '0', C);
  const fsCell = inpRow(sh, 7, 'Filing Status', 'Married Filing Jointly', null, C);
  fsCell.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Single','Married Filing Jointly'], true).build()
  );

  sh.setRowHeight(8, 8);
  sectionHdr(sh, 9, 'INCOME & CONTRIBUTIONS', C, 4);
  inpRow(sh, 10, 'Monthly Take-Home Pay (Today)',           8000,   '$#,##0',  C);
  inpRow(sh, 11, 'Gross Annual Income',                    150000,  '$#,##0',  C);
  inpRow(sh, 12, 'Annual 401k / 403b Contribution',         23500,  '$#,##0',  C);
  inpRow(sh, 13, 'Target Monthly Expenses in Retirement',    6000,  '$#,##0',  C);

  sh.setRowHeight(14, 8);
  sectionHdr(sh, 15, 'ASSUMPTIONS', C, 4);
  inpRow(sh, 16, 'Expected Annual Return',  0.07,  '0.0%', C);
  inpRow(sh, 17, 'Inflation Rate',          0.025, '0.0%', C);

  sh.setRowHeight(18, 8);
  sectionHdr(sh, 19, 'YOUR RETIREMENT PICTURE', C, 4);
  calcRow(sh, 20, 'Years to Retirement',              '=B6-B4',                           '0 "years"',    C);
  calcRow(sh, 21, 'Retirement Year',                  '=YEAR(TODAY())+B20',               '0',            C);
  calcRow(sh, 22, 'Total Portfolio Today',            "=IFERROR('BALANCES'!D17,0)",       '$#,##0',       C);
  calcRow(sh, 23, 'Projected Portfolio at Retirement','=B22*(1+B16)^B20',                 '$#,##0',       C);
  calcRow(sh, 24, 'Projected Monthly Income (4% Rule)','=B23*0.04/12',                    '$#,##0',       C);
  calcRow(sh, 25, 'Monthly Income Needed',            '=B13',                             '$#,##0',       C);
  calcRow(sh, 26, 'Monthly Surplus / (Shortfall)',    '=B24-B25',                         '$#,##0;($#,##0)',C);
  calcRow(sh, 27, 'Savings Gap (lump sum needed today)','=MAX(0,(B13*12/0.04)-B23)',      '$#,##0',       C);

  sh.setRowHeight(28, 8);
  const onTrack = sh.getRange(29, 1, 1, 4);
  onTrack.merge()
    .setFormula('=IF(B13=0,"← Enter your target monthly expenses in row 13 above",IF(B24>=B13*0.9,"✓  ON TRACK — Projected income covers your expenses",IF(B24>=B13*0.7,"⚠  CLOSE — Small gap. Maximize catch-up contributions.","✗  SIGNIFICANT GAP — Review your plan on WITHDRAWAL and CATCHUP tabs.")))')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(29, 40);

  const cfRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('ON TRACK').setBackground(C.green).setFontColor(C.greenText).setRanges([onTrack]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('CLOSE').setBackground(C.amber).setFontColor(C.amberText).setRanges([onTrack]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('SIGNIFICANT GAP').setBackground(C.red).setFontColor(C.redText).setRanges([onTrack]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Enter').setBackground(C.gray).setFontColor(C.darkGray).setRanges([onTrack]).build(),
  ];
  sh.setConditionalFormatRules(cfRules);

  sh.getRange(31, 1, 1, 4).merge()
    .setValue('Next step: Go to BALANCES tab and enter your account values. Then check GOLDILOCKS for your Roth conversion opportunity this year.')
    .setFontColor(C.darkGray).setFontSize(9).setWrap(true).setFontStyle('italic');
  sh.setRowHeight(31, 28);

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B4','B5','B6','B7','B10','B11','B12','B13','B16','B17']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: BALANCES
// Row map:
//   3=ColHeaders, 4-10=Accounts(Trad401k/Roth401k/TradIRA/RothIRA/Brokerage/HSA/Pension)
//   12=TotalsHdr, 13=TotalTraditional, 14=TotalRoth, 15=TotalTaxable, 16=TotalHSA
//   17=GRAND TOTAL
//   19=SSHdr, 20=SSColHeaders, 21=SSMonthlyBenefit, 22=SSStartAge, 23=SSAnnualBenefit
// ══════════════════════════════════════════════════════════════
function buildBalances(sh, C) {
  sh.setColumnWidth(1, 220); sh.setColumnWidth(2, 150);
  sh.setColumnWidth(3, 150); sh.setColumnWidth(4, 150); sh.setColumnWidth(5, 260);

  titleRow(sh, 1, 'ACCOUNT BALANCES', 'Enter your current balances in the yellow cells.', C, 5);

  // Column headers row 3
  ['Account', 'Your Balance', 'Spouse Balance', 'Combined', 'Where to Find This'].forEach((h, i) => {
    sh.getRange(3, i + 1).setValue(h)
      .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold')
      .setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sh.setRowHeight(3, 26);

  const accounts = [
    ['Traditional 401(k)',      'Fidelity/Vanguard login → Accounts → select 401k → balance shown'],
    ['Roth 401(k)',              'Same login — look for account labeled "Roth 401k"'],
    ['Traditional IRA',         'Separate IRA account — may be at a different institution'],
    ['Roth IRA',                 'Separate Roth IRA — Fidelity, Vanguard, Schwab, etc.'],
    ['Brokerage / Taxable',     'Non-retirement investment account (no IRA/401k label)'],
    ['HSA (Health Savings Acct)','HSA Bank, Fidelity HSA, or your employer HSA portal'],
    ['Pension (lump sum est.)', 'Ask HR for your pension statement or lump-sum equivalent'],
  ];

  accounts.forEach((acct, i) => {
    const r = 4 + i;
    sh.getRange(r, 1).setValue(acct[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setValue(0).setBackground(C.yellow).setNumberFormat('$#,##0').setFontWeight('bold');
    sh.getRange(r, 3).setValue(0).setBackground(C.yellow).setNumberFormat('$#,##0').setFontWeight('bold');
    sh.getRange(r, 4).setFormula(`=B${r}+C${r}`).setNumberFormat('$#,##0').setBackground(C.offWhite).setFontWeight('bold');
    sh.getRange(r, 5).setValue(acct[1]).setFontColor(C.darkGray).setFontSize(9).setWrap(true);
    sh.setRowHeight(r, 22);
  });
  // Row 11 = blank spacer

  // Totals section — row 12 header, 13-16 subtotals, 17 grand total
  sectionHdr(sh, 12, 'TOTALS', C, 5);
  const totals = [
    ['Total Pre-Tax (Traditional)',  '=B4+B6',        '=C4+C6',        '=D4+D6'],
    ['Total Tax-Free (Roth)',        '=B5+B7',        '=C5+C7',        '=D5+D7'],
    ['Total Taxable / Brokerage',   '=B8',           '=C8',           '=D8'],
    ['Total HSA',                    '=B9',           '=C9',           '=D9'],
  ];
  totals.forEach((row, i) => {
    const r = 13 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    [row[1], row[2], row[3]].forEach((f, j) => {
      sh.getRange(r, j + 2).setFormula(f).setNumberFormat('$#,##0').setBackground(C.offWhite);
    });
    sh.setRowHeight(r, 22);
  });

  // Grand total row 17
  sh.getRange(17, 1).setValue('TOTAL PORTFOLIO').setFontWeight('bold').setFontSize(11).setFontColor(C.white).setBackground(C.navy);
  ['=SUM(B4:B10)', '=SUM(C4:C10)', '=SUM(D4:D10)'].forEach((f, j) => {
    sh.getRange(17, j + 2).setFormula(f).setNumberFormat('$#,##0')
      .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(11);
  });
  sh.getRange(17, 5).setBackground(C.navy);
  sh.setRowHeight(17, 30);

  // Social Security section — row 19 header
  sectionHdr(sh, 19, 'SOCIAL SECURITY', C, 5);
  ['', 'You', 'Spouse', 'Combined', 'Where to Find This'].forEach((h, i) => {
    sh.getRange(20, i + 1).setValue(h)
      .setBackground(C.lightBlue).setFontColor(C.navy).setFontWeight('bold')
      .setFontSize(10).setHorizontalAlignment('center');
  });
  sh.setRowHeight(20, 24);

  // Row 21: Monthly Benefit
  sh.getRange(21, 1).setValue('Est. Monthly Benefit (at FRA)').setFontColor('#374151').setFontSize(10);
  sh.getRange(21, 2).setValue(2800).setBackground(C.yellow).setNumberFormat('$#,##0').setFontWeight('bold');
  sh.getRange(21, 3).setValue(0).setBackground(C.yellow).setNumberFormat('$#,##0').setFontWeight('bold');
  sh.getRange(21, 4).setFormula('=B21+C21').setNumberFormat('$#,##0').setBackground(C.offWhite).setFontWeight('bold');
  sh.getRange(21, 5).setValue('ssa.gov → Sign In → my Social Security → Estimated Benefits').setFontColor(C.darkGray).setFontSize(9).setWrap(true);
  sh.setRowHeight(21, 22);

  // Row 22: Start Age
  sh.getRange(22, 1).setValue('Planned Start Age').setFontColor('#374151').setFontSize(10);
  sh.getRange(22, 2).setValue(67).setBackground(C.yellow).setFontWeight('bold');
  sh.getRange(22, 3).setValue(67).setBackground(C.yellow).setFontWeight('bold');
  sh.getRange(22, 5).setValue('62 = early (reduced 30%), 67 = full retirement age, 70 = maximum (+24%)').setFontColor(C.darkGray).setFontSize(9).setWrap(true);
  sh.setRowHeight(22, 22);

  // Row 23: Annual Benefit
  sh.getRange(23, 1).setValue('Annual Benefit').setFontColor('#374151').setFontSize(10);
  sh.getRange(23, 2).setFormula('=B21*12').setNumberFormat('$#,##0').setBackground(C.offWhite).setFontWeight('bold');
  sh.getRange(23, 3).setFormula('=C21*12').setNumberFormat('$#,##0').setBackground(C.offWhite).setFontWeight('bold');
  sh.getRange(23, 4).setFormula('=D21*12').setNumberFormat('$#,##0').setBackground(C.offWhite).setFontWeight('bold');
  sh.setRowHeight(23, 22);

  sh.setFrozenRows(3);
  lockFormulas(sh, ['B4:C10','B21:C21','B22:C22']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: GOLDILOCKS (Roth Conversion Ladder)
// Row map:
//   4=CurAge, 5=RetireAge, 6=FilingStatus, 7=GrossIncome, 8=401kContrib
//   9=TradBalance, 10=RothBalance, 11=ExpReturn, 12=BracketTarget
//   15=StdDeduction, 16=AGI, 17=TaxableIncome, 18=BracketTop
//   19=IRMAASafeLimit, 20=RoomInBracket, 21=RoomBeforeIRMAA
//   23=GoldilocksAmount, 24=TaxOnConversion, 25=IRMAAStatus
//   28=TableHeaders, 29+=YearByYearRows
// ══════════════════════════════════════════════════════════════
function buildGoldilocks(sh, C) {
  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 130);
  for (let i = 3; i <= 11; i++) sh.setColumnWidth(i, 110);

  titleRow(sh, 1, 'GOLDILOCKS ROTH CONVERSION LADDER',
    'Convert just enough to fill your tax bracket each year — not too much, not too little.', C, 11);

  // Inputs — pull from other tabs (blue = linked, not editable)
  sectionHdr(sh, 3, 'INPUTS (linked from SNAPSHOT & BALANCES)', C, 11);

  const linkedInputs = [
    ['Current Age',                    "='SNAPSHOT'!B4",   '0'],
    ['Retirement Age',                 "='SNAPSHOT'!B6",   '0'],
    ['Filing Status',                  "='SNAPSHOT'!B7",   '@'],
    ['Gross Annual Income',            "='SNAPSHOT'!B11",  '$#,##0'],
    ['Annual 401k Contribution',       "='SNAPSHOT'!B12",  '$#,##0'],
    ['Traditional Balance (all accts)',"=IFERROR('BALANCES'!B13,0)", '$#,##0'],
    ['Starting Roth Balance',          "=IFERROR('BALANCES'!B14,0)", '$#,##0'],
    ['Expected Annual Return',         "='SNAPSHOT'!B16",  '0.0%'],
  ];
  linkedInputs.forEach((row, i) => {
    const r = 4 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // Row 12: Bracket target — buyer's only editable input on this tab
  sh.getRange(12, 1).setValue('Convert up to top of which bracket?').setFontColor('#374151').setFontSize(10);
  const bracketCell = sh.getRange(12, 2);
  bracketCell.setValue('24%').setBackground(C.yellow).setFontWeight('bold');
  bracketCell.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['22%','24%'], true).build()
  );
  sh.setRowHeight(12, 22);

  // Calculations section
  sh.setRowHeight(13, 8);
  sectionHdr(sh, 14, "THIS YEAR'S GOLDILOCKS NUMBER", C, 11);

  const calcs = [
    ['Standard Deduction',        '=IF(B6="Married Filing Jointly",30000,15000)',  '$#,##0'],
    ['AGI Before Conversion',     '=B7-B8',                                        '$#,##0'],
    ['Taxable Income Before Conv','=B16-B15',                                       '$#,##0'],
    ['Top of Target Bracket',     '=IF(B12="22%",IF(B6="Married Filing Jointly",206700,103350),IF(B6="Married Filing Jointly",394600,197300))', '$#,##0'],
    ['IRMAA Safe Limit (MAGI)',   '=IF(B6="Married Filing Jointly",212000,106000)','$#,##0'],
    ['Room Before Bracket Ceiling','=MAX(0,B18-B17)',                              '$#,##0'],
    ['Room Before IRMAA',         '=MAX(0,B19-B16)',                               '$#,##0'],
  ];
  calcs.forEach((row, i) => {
    const r = 15 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setNumberFormat(row[2]).setFontWeight('bold');
    sh.setRowHeight(r, 22);
  });

  // Row 22 spacer
  sh.setRowHeight(22, 8);

  // Goldilocks Amount — big highlight row 23
  sh.getRange(23, 1).setValue('GOLDILOCKS AMOUNT — Convert This Much').setFontWeight('bold').setFontSize(11).setFontColor(C.navy);
  sh.getRange(23, 2).setFormula('=MIN(B20,B21,B9)')
    .setBackground('#fef9c3').setFontWeight('bold').setFontSize(14)
    .setFontColor('#d97706').setNumberFormat('$#,##0');
  sh.setRowHeight(23, 32);

  // Row 24: Tax on conversion
  sh.getRange(24, 1).setValue("Tax You'll Pay on This Conversion").setFontColor('#374151').setFontSize(10);
  sh.getRange(24, 2).setFormula(taxFormula('B17','B23','B6').replace('=','='))
    .setBackground(C.offWhite).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(24, 22);

  // Row 25: IRMAA status
  sh.getRange(25, 1).setValue('IRMAA Status').setFontColor('#374151').setFontSize(10);
  sh.getRange(25, 2).setFormula('=IF(B16+B23<=B19,"✓ Safe from IRMAA surcharge","⚠ NEAR IRMAA — verify before converting")')
    .setFontWeight('bold').setFontSize(10);
  sh.setRowHeight(25, 22);

  const irmaaRange = sh.getRange(25, 2);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Safe').setBackground(C.green).setFontColor(C.greenText).setRanges([irmaaRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('NEAR').setBackground(C.amber).setFontColor(C.amberText).setRanges([irmaaRange]).build(),
  ]);

  // Year-by-year table
  sh.setRowHeight(26, 8);
  sectionHdr(sh, 27, 'YEAR-BY-YEAR CONVERSION PLAN', C, 11);
  tblHeader(sh, 28, ['Year','Age','W2 Income','AGI','Taxable Income','Goldilocks Convert','Tax on Conv','Trad Balance','Roth Balance','IRMAA Safe?','Trad (No Convert)'], C);

  SpreadsheetApp.flush();
  // Generate rows — up to 15 years
  for (let i = 0; i < 15; i++) {
    const r = 29 + i;
    const yr = i + 1;
    const bg = i % 2 === 0 ? C.white : C.offWhite;

    sh.getRange(r, 1).setValue(yr).setHorizontalAlignment('center');
    sh.getRange(r, 2).setFormula(i === 0 ? '=$B$4' : `=B${r-1}+1`).setHorizontalAlignment('center');

    // Income grows at 2% per year
    sh.getRange(r, 3).setFormula(i === 0 ? '=$B$7' : `=C${r-1}*1.02`).setNumberFormat('$#,##0');

    // AGI = Income - 401k contribution
    sh.getRange(r, 4).setFormula(`=C${r}-$B$8`).setNumberFormat('$#,##0');

    // Taxable Income = AGI - Standard Deduction
    sh.getRange(r, 5).setFormula(`=D${r}-$B$15`).setNumberFormat('$#,##0');

    // Goldilocks — 0 if already retired; use starting balance (B9) for year 1, prior H for later years
    const tradRef = i === 0 ? '$B$9' : `H${r-1}`;
    sh.getRange(r, 6).setFormula(
      `=IF(B${r}>=$B$5,0,MIN(MAX(0,$B$18-E${r}),MAX(0,$B$19-D${r}),${tradRef}))`
    ).setNumberFormat('$#,##0');

    // Tax on conversion
    sh.getRange(r, 7).setFormula(
      taxFormula(`E${r}`, `F${r}`, '$B$6').replace('=','=')
    ).setNumberFormat('$#,##0');

    // Traditional balance (end of year): prior balance * (1+return) - conversion
    const prevTrad = i === 0 ? '$B$9' : `H${r-1}`;
    sh.getRange(r, 8).setFormula(`=${prevTrad}*(1+$B$11)-F${r}`).setNumberFormat('$#,##0');

    // Roth balance (end of year): prior balance * (1+return) + conversion
    const prevRoth = i === 0 ? '$B$10' : `I${r-1}`;
    sh.getRange(r, 9).setFormula(`=${prevRoth}*(1+$B$11)+F${r}`).setNumberFormat('$#,##0');

    // IRMAA check
    sh.getRange(r, 10).setFormula(`=IF(D${r}+F${r}<=$B$19,"✓","⚠")`).setHorizontalAlignment('center').setFontWeight('bold');

    // No-convert scenario (traditional balance grows untouched)
    const prevNoConv = i === 0 ? '$B$9' : `K${r-1}`;
    sh.getRange(r, 11).setFormula(`=${prevNoConv}*(1+$B$11)`).setNumberFormat('$#,##0');

    sh.getRange(r, 1, 1, 11).setBackground(bg);
    sh.setRowHeight(r, 20);
  }

  // Conditional formatting on Goldilocks column (F)
  const goldiRange = sh.getRange(29, 6, 15, 1);
  const goldiRules = sh.getConditionalFormatRules();
  goldiRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0).setBackground(C.green).setRanges([goldiRange]).build());
  goldiRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberEqualTo(0).setBackground(C.red).setFontColor(C.redText).setRanges([goldiRange]).build());
  sh.setConditionalFormatRules(goldiRules);

  // Summary section
  const sumRow = 45;
  sh.setRowHeight(sumRow - 1, 8);
  sectionHdr(sh, sumRow, 'CONVERSION IMPACT SUMMARY', C, 11);

  const summaries = [
    ['Total Roth Conversions (all years)', `=SUM(F29:F43)`,   '$#,##0'],
    ['Total Tax Paid on Conversions',      `=SUM(G29:G43)`,   '$#,##0'],
    ['Traditional Balance at Retirement (converting)',    `=VLOOKUP($B$5,B29:H43,7,FALSE)`, '$#,##0'],
    ['Traditional Balance at Retirement (NOT converting)',`=VLOOKUP($B$5,B29:K43,10,FALSE)`,'$#,##0'],
    ['Roth Balance at Retirement',         `=VLOOKUP($B$5,B29:I43,8,FALSE)`, '$#,##0'],
    ['Est. 1st RMD (Converting, Age 73)',  `=IFERROR(VLOOKUP($B$5,B29:H43,7,FALSE)/26.5,0)`, '$#,##0'],
    ['Est. 1st RMD (NOT Converting, Age 73)',`=IFERROR(VLOOKUP($B$5,B29:K43,10,FALSE)/26.5,0)`,'$#,##0'],
    ['Annual Tax Saved on RMDs (est. 22%)','=MAX(0,(B52-B51))*0.22',           '$#,##0'],
    ['Break-Even: Years to Recoup Taxes',  '=IFERROR(B47/B53,0)',              '0.0 "years"'],
  ];
  summaries.forEach((row, i) => {
    const r = sumRow + 1 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold').setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });
  // Highlight break-even row
  sh.getRange(sumRow + 9, 1, 1, 2).setBackground(C.amber);
  sh.getRange(sumRow + 9, 1).setFontWeight('bold').setFontColor(C.amberText);

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B12']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: RMD PROJECTOR
// ══════════════════════════════════════════════════════════════
function buildRMD(sh, C) {
  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 150);
  sh.setColumnWidth(3, 90);  sh.setColumnWidth(4, 130); sh.setColumnWidth(5, 130);
  sh.setColumnWidth(6, 130); sh.setColumnWidth(7, 130); sh.setColumnWidth(8, 130);

  titleRow(sh, 1, 'RMD PROJECTOR',
    'Required Minimum Distributions start at age 73. This shows why Roth conversions matter.', C, 8);

  sectionHdr(sh, 3, 'INPUTS', C, 8);
  const linkedRMD = [
    ['Current Age',          "='SNAPSHOT'!B4",   '0'],
    ['Retirement Age',       "='SNAPSHOT'!B6",   '0'],
    ['Filing Status',        "='SNAPSHOT'!B7",   '@'],
    ['Expected Annual Return',"='SNAPSHOT'!B16", '0.0%'],
  ];
  linkedRMD.forEach((row, i) => {
    const r = 4 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  sh.getRange(8, 1).setValue('Traditional Balance at Retirement').setFontColor('#374151').setFontSize(10);
  sh.getRange(8, 2).setValue(0).setBackground(C.yellow).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.getRange(8, 3, 1, 5).merge().setValue('← Paste from GOLDILOCKS summary (row 48) OR enter manually')
    .setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic');
  sh.setRowHeight(8, 22);

  sh.getRange(9, 1).setValue('SS Monthly Benefit (Combined)').setFontColor('#374151').setFontSize(10);
  sh.getRange(9, 2).setFormula("=IFERROR('BALANCES'!D21,0)").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(9, 22);

  sh.getRange(10, 1).setValue('Standard Deduction').setFontColor('#374151').setFontSize(10);
  sh.getRange(10, 2).setFormula("=IF(B6=\"Married Filing Jointly\",30000,15000)").setBackground(C.offWhite).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(10, 22);

  // Calculated: balance at age 73 (grown from retirement)
  sh.getRange(11, 1).setValue('Est. Traditional Balance at Age 73').setFontColor('#374151').setFontSize(10);
  sh.getRange(11, 2).setFormula('=B8*(1+B7)^(73-B5)').setBackground(C.offWhite).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(11, 22);

  // Table
  sh.setRowHeight(12, 8);
  sectionHdr(sh, 13, 'RMD PROJECTION — AGES 73 to 90', C, 8);
  tblHeader(sh, 14, ['Year','Age','Trad Balance (Start)','IRS Divisor','RMD Required','SS Income (Annual)','Total Gross Income','Est. Tax (22%)'], C);

  const rmdDivisors = [26.5,25.5,24.6,23.7,22.9,22.0,21.1,20.2,19.4,18.5,17.7,16.8,16.0,15.2,14.4,13.7,12.9,12.2];

  rmdDivisors.forEach((divisor, i) => {
    const age = 73 + i;
    const r = 15 + i;
    const bg = i % 2 === 0 ? C.white : C.offWhite;
    const yr = `=YEAR(TODAY())+(${age}-$B$4)`;

    sh.getRange(r, 1).setFormula(yr).setNumberFormat('0').setHorizontalAlignment('center');
    sh.getRange(r, 2).setValue(age).setHorizontalAlignment('center');

    // Balance at start of year
    if (i === 0) {
      sh.getRange(r, 3).setFormula('=$B$11').setNumberFormat('$#,##0');
    } else {
      sh.getRange(r, 3).setFormula(`=MAX(0,(C${r-1}-E${r-1})*(1+$B$7))`).setNumberFormat('$#,##0');
    }

    sh.getRange(r, 4).setValue(divisor).setNumberFormat('0.0').setHorizontalAlignment('center');
    sh.getRange(r, 5).setFormula(`=IFERROR(C${r}/D${r},0)`).setNumberFormat('$#,##0');
    sh.getRange(r, 6).setFormula(`=IF(${age}>='BALANCES'!B22,$B$9*12,0)`).setNumberFormat('$#,##0');
    sh.getRange(r, 7).setFormula(`=E${r}+F${r}*0.85`).setNumberFormat('$#,##0');  // 85% of SS taxable
    sh.getRange(r, 8).setFormula(`=MAX(0,G${r}-$B$10)*0.22`).setNumberFormat('$#,##0');

    sh.getRange(r, 1, 1, 8).setBackground(bg);
    sh.setRowHeight(r, 20);
  });

  // Totals
  const totR = 15 + rmdDivisors.length + 1;
  sh.getRange(totR, 1, 1, 4).merge().setValue('TOTALS (Ages 73–90)').setFontWeight('bold').setBackground(C.navy).setFontColor(C.white);
  sh.getRange(totR, 5).setFormula(`=SUM(E15:E${totR-2})`).setNumberFormat('$#,##0').setBackground(C.navy).setFontColor(C.white).setFontWeight('bold');
  sh.getRange(totR, 8).setFormula(`=SUM(H15:H${totR-2})`).setNumberFormat('$#,##0').setBackground(C.navy).setFontColor(C.white).setFontWeight('bold');
  sh.setRowHeight(totR, 26);

  sh.getRange(totR + 2, 1, 1, 8).merge()
    .setValue('Note: RMD is calculated on the PRIOR year-end balance ÷ IRS divisor. 85% of Social Security is assumed taxable at these income levels. Roth conversions before retirement (see GOLDILOCKS tab) reduce your taxable balance here and lower every one of these numbers.')
    .setFontColor(C.darkGray).setFontSize(9).setWrap(true).setFontStyle('italic');
  sh.setRowHeight(totR + 2, 40);

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B8']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: SOCIAL SECURITY OPTIMIZER
// ══════════════════════════════════════════════════════════════
function buildSS(sh, C) {
  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 130); sh.setColumnWidth(3, 130);
  sh.setColumnWidth(4, 130); sh.setColumnWidth(5, 130); sh.setColumnWidth(6, 200);

  titleRow(sh, 1, 'SOCIAL SECURITY OPTIMIZER',
    'Find your break-even age and the best claiming strategy for your household.', C, 6);

  sectionHdr(sh, 3, 'INPUTS', C, 6);
  sh.getRange(4, 1).setValue('Your FRA Monthly Benefit (from SSA.gov)').setFontColor('#374151').setFontSize(10);
  sh.getRange(4, 2).setFormula("=IFERROR('BALANCES'!B21,0)").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.getRange(4, 3, 1, 3).merge().setValue('← Auto-filled from BALANCES. Update there first.').setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic');
  sh.setRowHeight(4, 22);

  sh.getRange(5, 1).setValue('Spouse FRA Monthly Benefit').setFontColor('#374151').setFontSize(10);
  sh.getRange(5, 2).setFormula("=IFERROR('BALANCES'!C21,0)").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(5, 22);

  sh.getRange(6, 1).setValue('Your Current Age').setFontColor('#374151').setFontSize(10);
  sh.getRange(6, 2).setFormula("='SNAPSHOT'!B4").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('0');
  sh.setRowHeight(6, 22);

  sh.getRange(7, 1).setValue('Longevity Assumption (age you plan to live to)').setFontColor('#374151').setFontSize(10);
  const longCell = sh.getRange(7, 2);
  longCell.setValue(85).setBackground(C.yellow).setFontWeight('bold');
  longCell.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['80','82','85','87','90','92','95'], true).build());
  sh.setRowHeight(7, 22);

  // Three scenarios
  sh.setRowHeight(8, 8);
  sectionHdr(sh, 9, 'YOUR THREE CLAIMING OPTIONS', C, 6);
  ['Strategy','Claiming Age','Monthly Benefit','Annual Benefit','Total by Longevity Age','Notes'].forEach((h, i) => {
    sh.getRange(10, i + 1).setValue(h).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(9).setWrap(true).setHorizontalAlignment('center');
  });
  sh.setRowHeight(10, 26);

  const strategies = [
    ['Take Early',         62, '=$B$4*0.70', '75% of FRA benefit — permanently reduced'],
    ['Full Retirement Age',67, '=$B$4*1.00', 'Full benefit — your baseline'],
    ['Delay Maximum',      70, '=$B$4*1.24', '24% more than FRA — best if healthy & long-lived'],
  ];
  strategies.forEach((row, i) => {
    const r = 11 + i;
    const bg = i % 2 === 0 ? C.white : C.offWhite;
    sh.getRange(r, 1).setValue(row[0]).setFontWeight('bold').setFontSize(10);
    sh.getRange(r, 2).setValue(row[1]).setHorizontalAlignment('center');
    sh.getRange(r, 3).setFormula(row[2]).setNumberFormat('$#,##0');
    sh.getRange(r, 4).setFormula(`=C${r}*12`).setNumberFormat('$#,##0');
    // Total by longevity: monthly * 12 * (longevity - claiming age), starting from claiming age
    sh.getRange(r, 5).setFormula(`=C${r}*12*MAX(0,$B$7-${row[1]})`).setNumberFormat('$#,##0');
    sh.getRange(r, 6).setValue(row[3]).setFontColor(C.darkGray).setFontSize(9).setWrap(true);
    sh.getRange(r, 1, 1, 6).setBackground(bg);
    sh.setRowHeight(r, 22);
  });

  // Breakeven section
  sh.setRowHeight(15, 8);
  sectionHdr(sh, 16, 'BREAK-EVEN AGES', C, 6);
  sh.getRange(17, 1, 1, 6).merge().setValue('The age at which delaying pays off — "if you expect to live past this age, waiting is worth it."')
    .setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic').setWrap(true);
  sh.setRowHeight(17, 22);

  const breakevenRows = [
    ['Take at 62 vs 67', '=67+(($B$4*0.70*60)/($B$4*1.00-$B$4*0.70))/12'],
    ['Take at 67 vs 70', '=70+(($B$4*1.00*36)/($B$4*1.24-$B$4*1.00))/12'],
    ['Take at 62 vs 70', '=70+(($B$4*0.70*96)/($B$4*1.24-$B$4*0.70))/12'],
  ];
  breakevenRows.forEach((row, i) => {
    const r = 18 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10).setFontWeight('bold');
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.amber).setFontWeight('bold').setFontSize(11).setNumberFormat('0.0 "years old"');
    sh.getRange(r, 3, 1, 4).merge().setValue('← If you expect to live past this age, the later claiming age pays more total.').setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic');
    sh.setRowHeight(r, 24);
  });

  // Cumulative comparison table
  sh.setRowHeight(22, 8);
  sectionHdr(sh, 23, 'CUMULATIVE BENEFITS BY AGE — TAKE AT 62 vs 67 vs 70', C, 6);
  ['Age','Take at 62 (Cumulative)','Take at 67 (Cumulative)','Take at 70 (Cumulative)','Best Strategy',''].forEach((h, i) => {
    sh.getRange(24, i + 1).setValue(h).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
  });
  sh.setRowHeight(24, 24);

  SpreadsheetApp.flush();
  for (let i = 0; i < 31; i++) {
    const age = 62 + i;
    const r = 25 + i;
    const bg = i % 2 === 0 ? C.white : C.offWhite;
    sh.getRange(r, 1).setValue(age).setHorizontalAlignment('center');
    sh.getRange(r, 2).setFormula(`=$B$4*0.70*12*MAX(0,${age}-62)`).setNumberFormat('$#,##0');
    sh.getRange(r, 3).setFormula(`=$B$4*1.00*12*MAX(0,${age}-67)`).setNumberFormat('$#,##0');
    sh.getRange(r, 4).setFormula(`=$B$4*1.24*12*MAX(0,${age}-70)`).setNumberFormat('$#,##0');
    sh.getRange(r, 5).setFormula(`=IF(AND(${age}<67,B${r}>0),"62",IF(AND(${age}>=67,${age}<70,C${r}>B${r}),"67",IF(D${r}>C${r},"70","67")))`).setHorizontalAlignment('center').setFontWeight('bold');
    sh.getRange(r, 1, 1, 5).setBackground(bg);
    sh.setRowHeight(r, 18);
  }

  // Highlight row where 70 surpasses 62
  const breakEvenHighlight = sh.getRange(25, 1, 31, 5);
  const beCfRules = [
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(D25>B25,D24<=B24)').setBackground('#bbf7d0').setRanges([breakEvenHighlight]).build(),
  ];
  sh.setConditionalFormatRules(beCfRules);

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B7']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: WITHDRAWAL STRATEGY
// ══════════════════════════════════════════════════════════════
function buildWithdrawal(sh, C) {
  sh.setColumnWidth(1, 220); sh.setColumnWidth(2, 150);
  sh.setColumnWidth(3, 130); sh.setColumnWidth(4, 130); sh.setColumnWidth(5, 130);
  sh.setColumnWidth(6, 130); sh.setColumnWidth(7, 110); sh.setColumnWidth(8, 110);

  titleRow(sh, 1, 'WITHDRAWAL STRATEGY',
    'The 4% Rule + tax-efficient sequencing. Draw Taxable first, Traditional second, Roth last.', C, 8);

  sectionHdr(sh, 3, 'INPUTS', C, 8);
  const wInputs = [
    ['Taxable Balance at Retirement',      '0',      '$#,##0',  true,  'Manual — from GOLDILOCKS summary or BALANCES'],
    ['Traditional Balance at Retirement',  '0',      '$#,##0',  true,  'Manual — from GOLDILOCKS summary'],
    ['Roth Balance at Retirement',         '0',      '$#,##0',  true,  'Manual — from GOLDILOCKS summary'],
    ['Annual SS Income (Combined)',        "=IFERROR('BALANCES'!D23,0)", '$#,##0', false, 'Auto-linked from BALANCES'],
    ['SS Start Age',                       "=IFERROR('BALANCES'!B22,67)", '0',    false, 'Auto-linked from BALANCES'],
    ['Annual Retirement Expenses',         "='SNAPSHOT'!B13*12",  '$#,##0', false, 'Auto-linked from SNAPSHOT'],
    ['Expected Annual Return',             "='SNAPSHOT'!B16",     '0.0%',   false, ''],
    ['Inflation Rate',                     "='SNAPSHOT'!B17",     '0.0%',   false, ''],
    ['Retirement Age',                     "='SNAPSHOT'!B6",      '0',      false, ''],
  ];
  wInputs.forEach((row, i) => {
    const r = 4 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    if (row[3]) {
      sh.getRange(r, 2).setValue(row[1]).setBackground(C.yellow).setFontWeight('bold').setNumberFormat(row[2]);
    } else {
      sh.getRange(r, 2).setFormula(row[1]).setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat(row[2]);
    }
    if (row[4]) sh.getRange(r, 3, 1, 5).merge().setValue(row[4]).setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic');
    sh.setRowHeight(r, 22);
  });

  // 4% Rule check
  sh.setRowHeight(14, 8);
  sectionHdr(sh, 15, '4% RULE CHECK', C, 8);
  const fourPctCalcs = [
    ['Total Portfolio at Retirement',   '=B4+B5+B6',          '$#,##0'],
    ['Safe Annual Withdrawal (4% Rule)','=B16*0.04',           '$#,##0'],
    ['Monthly Income from Portfolio',   '=B17/12',             '$#,##0'],
    ['Annual Expenses Needed',          '=B9',                 '$#,##0'],
    ['Annual Surplus / (Gap)',          '=B17-B19',            '$#,##0;($#,##0)'],
  ];
  fourPctCalcs.forEach((row, i) => {
    const r = 16 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold').setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // Verdict row
  sh.getRange(21, 1, 1, 8).merge()
    .setFormula('=IF(B9=0,"← Enter annual expenses in row 9",IF(B17>=B19,"✓ FUNDED — 4% Rule covers your annual expenses",IF(B17>=B19*0.80,"⚠ MOSTLY FUNDED — Small gap of $"&TEXT(B19-B17,"#,##0")&"/yr. Adjust spending or delay retirement.","✗ GAP — Shortfall of $"&TEXT(B19-B17,"#,##0")&"/yr. Review CATCHUP tab.")))')
    .setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(21, 36);
  const verdictRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('FUNDED —').setBackground(C.green).setFontColor(C.greenText).setRanges([sh.getRange(21, 1, 1, 8)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('MOSTLY').setBackground(C.amber).setFontColor(C.amberText).setRanges([sh.getRange(21, 1, 1, 8)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('GAP —').setBackground(C.red).setFontColor(C.redText).setRanges([sh.getRange(21, 1, 1, 8)]).build(),
  ];
  sh.setConditionalFormatRules(verdictRules);

  // 30-year table
  sh.setRowHeight(22, 8);
  sectionHdr(sh, 23, '30-YEAR WITHDRAWAL PROJECTION', C, 8);
  tblHeader(sh, 24, ['Year','Age','Expenses','SS Income','Gap to Fill','Taxable Bal','Trad Bal','Roth Bal'], C);

  SpreadsheetApp.flush();
  for (let i = 0; i < 30; i++) {
    const r = 25 + i;
    const bg = i % 2 === 0 ? C.white : C.offWhite;

    sh.getRange(r, 1).setValue(i + 1).setHorizontalAlignment('center');
    sh.getRange(r, 2).setFormula(i === 0 ? '=$B$12' : `=B${r-1}+1`).setHorizontalAlignment('center');
    sh.getRange(r, 3).setFormula(i === 0 ? '=$B$9' : `=C${r-1}*(1+$B$11)`).setNumberFormat('$#,##0');
    sh.getRange(r, 4).setFormula(`=IF(B${r}>=$B$10,$B$7,0)`).setNumberFormat('$#,##0');
    sh.getRange(r, 5).setFormula(`=MAX(0,C${r}-D${r})`).setNumberFormat('$#,##0');

    // Taxable balance
    const prevTax = i === 0 ? '$B$4' : `F${r-1}`;
    sh.getRange(r, 6).setFormula(`=MAX(0,${prevTax}-MIN(E${r},${prevTax}))*(1+$B$10)`).setNumberFormat('$#,##0');

    // Traditional balance
    const prevTrad = i === 0 ? '$B$5' : `G${r-1}`;
    const tradDraw = i === 0 ? `MAX(0,E${r}-MIN(E${r},$B$4))` : `MAX(0,E${r}-MIN(E${r},F${r-1}))`;
    sh.getRange(r, 7).setFormula(`=MAX(0,(${prevTrad}-MIN(${tradDraw},${prevTrad}))*(1+$B$10))`).setNumberFormat('$#,##0');

    // Roth balance
    const prevRoth = i === 0 ? '$B$6' : `H${r-1}`;
    sh.getRange(r, 8).setFormula(`=MAX(0,${prevRoth}*(1+$B$10))`).setNumberFormat('$#,##0');

    sh.getRange(r, 1, 1, 8).setBackground(bg);
    sh.setRowHeight(r, 18);
  }

  // Conditional format: red when taxable+trad both hit 0
  const balRange = sh.getRange(25, 6, 30, 2);
  const wdRules = sh.getConditionalFormatRules();
  wdRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberEqualTo(0).setBackground(C.red).setFontColor(C.redText).setRanges([balRange]).build());
  sh.setConditionalFormatRules(wdRules);

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B4:B6']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: CATCH-UP TRACKER
// ══════════════════════════════════════════════════════════════
function buildCatchUp(sh, C) {
  sh.setColumnWidth(1, 250); sh.setColumnWidth(2, 130); sh.setColumnWidth(3, 130);
  sh.setColumnWidth(4, 130); sh.setColumnWidth(5, 130); sh.setColumnWidth(6, 160);

  titleRow(sh, 1, 'CATCH-UP CONTRIBUTION TRACKER',
    '2025 limits. If you\'re 50+ you get extra. If you\'re 55+ your HSA catch-up also kicks in.', C, 6);

  // Age reference
  sh.getRange(3, 1).setValue('Your Age').setFontColor('#374151').setFontSize(10);
  sh.getRange(3, 2).setFormula("='SNAPSHOT'!B4").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('0');
  sh.setRowHeight(3, 22);

  // 2025 Limits table
  sh.setRowHeight(4, 8);
  sectionHdr(sh, 5, '2025 IRS CONTRIBUTION LIMITS', C, 6);
  ['Account','Base Limit','Catch-Up (50+)','Your Total Max','2025 YTD','Remaining Room'].forEach((h, i) => {
    sh.getRange(6, i + 1).setValue(h).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
  });
  sh.setRowHeight(6, 24);

  const limits = [
    ['401k / 403b',   23500, 7500,  '=IF($B$3>=50,B7+C7,B7)',  '0', '=D7-E7'],
    ['IRA (Trad/Roth)',7000, 1000,  '=IF($B$3>=50,B8+C8,B8)',  '0', '=D8-E8'],
    ['HSA (self)',     4300, 1000,  '=IF($B$3>=55,B9+C9,B9)',  '0', '=D9-E9'],
    ['HSA (family)',   8550, 1000,  '=IF($B$3>=55,B10+C10,B10)','0','=D10-E10'],
  ];
  limits.forEach((row, i) => {
    const r = 7 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setValue(row[1]).setBackground(C.offWhite).setNumberFormat('$#,##0');
    sh.getRange(r, 3).setValue(row[2]).setBackground(C.offWhite).setNumberFormat('$#,##0');
    sh.getRange(r, 4).setFormula(row[3]).setBackground(C.green).setFontWeight('bold').setNumberFormat('$#,##0');
    sh.getRange(r, 5).setValue(0).setBackground(C.yellow).setFontWeight('bold').setNumberFormat('$#,##0');
    sh.getRange(r, 6).setFormula(row[5]).setBackground(C.offWhite).setFontWeight('bold').setNumberFormat('$#,##0');
    sh.setRowHeight(r, 22);
  });

  // Employer match section
  sh.setRowHeight(12, 8);
  sectionHdr(sh, 13, 'EMPLOYER MATCH OPTIMIZER', C, 6);
  sh.getRange(14, 1).setValue('Annual Salary').setFontColor('#374151').setFontSize(10);
  sh.getRange(14, 2).setFormula("='SNAPSHOT'!B11").setBackground(C.lightBlue).setFontWeight('bold').setNumberFormat('$#,##0');
  sh.setRowHeight(14, 22);

  sh.getRange(15, 1).setValue('Employer Match % (e.g. 0.04 = 4%)').setFontColor('#374151').setFontSize(10);
  sh.getRange(15, 2).setValue(0.04).setBackground(C.yellow).setFontWeight('bold').setNumberFormat('0.0%');
  sh.setRowHeight(15, 22);

  const matchCalcs = [
    ['Max Employer Match (Annual)',        '=B14*B15',    '$#,##0'],
    ['Your 401k YTD (annualized)',         '=E7/MONTH(TODAY())*12', '$#,##0'],
    ['Are You Capturing Full Match?',      '=IF(B17>=B16,"✓ Full match captured","⚠ Contribute "&TEXT(B16,"$#,##0")&"/yr to capture full match")', null],
  ];
  matchCalcs.forEach((row, i) => {
    const r = 16 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold');
    if (row[2]) sh.getRange(r, 2).setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // Match conditional formatting
  const matchRange = sh.getRange(18, 2);
  const matchRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Full match').setBackground(C.green).setFontColor(C.greenText).setRanges([matchRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Contribute').setBackground(C.amber).setFontColor(C.amberText).setRanges([matchRange]).build(),
  ];
  sh.setConditionalFormatRules(matchRules);

  // Contribution timing alert
  sh.setRowHeight(20, 8);
  sectionHdr(sh, 21, 'CONTRIBUTION TIMING ALERT', C, 6);
  sh.getRange(22, 1, 1, 6).merge()
    .setValue('If you contribute too fast, you\'ll hit the 401k limit early — and lose employer match for the remaining months of the year.')
    .setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic').setWrap(true);
  sh.setRowHeight(22, 22);

  const timingCalcs = [
    ['Monthly Contribution Pace',        '=IFERROR(E7/MONTH(TODAY()),0)',        '$#,##0'],
    ['Projected Month Limit Hit',        '=IFERROR(MIN(12,CEILING(D7/B23,1)),12)','0'],
    ['Months Left Without Match',        '=MAX(0,12-B24)',                       '0 "months"'],
    ['Est. Match Dollars Lost',          '=B25*(B14/12)*B15',                    '$#,##0'],
    ['ALERT',                            '=IF(B24<12,"⚠ You\'ll max out in month "&B24&" — could lose "&TEXT(B26,"$#,##0")&" in match. Spread contributions evenly!","✓ Contribution pace is fine — on track to hit limit in December")', null],
  ];
  timingCalcs.forEach((row, i) => {
    const r = 23 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold');
    if (row[2]) sh.getRange(r, 2).setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // Alert row
  sh.getRange(27, 1, 1, 6).merge()
    .setFormula('=IF(B24<12,"⚠  YOU\'LL HIT THE LIMIT IN MONTH "&B24&" — LOSING EMPLOYER MATCH FOR "&B25&" MONTHS. Spread contributions evenly throughout the year.","✓  CONTRIBUTION PACE IS FINE — On track to hit the limit in December.")')
    .setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(27, 36);
  const alertRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('⚠').setBackground(C.red).setFontColor(C.redText).setRanges([sh.getRange(27, 1, 1, 6)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('✓').setBackground(C.green).setFontColor(C.greenText).setRanges([sh.getRange(27, 1, 1, 6)]).build(),
  ];
  sh.setConditionalFormatRules(sh.getConditionalFormatRules().concat(alertRules));

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B15','E7:E10']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: MEDICARE & HEALTHCARE BRIDGE
// ══════════════════════════════════════════════════════════════
function buildMedicare(sh, C) {
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 160);
  sh.setColumnWidth(3, 130); sh.setColumnWidth(4, 130); sh.setColumnWidth(5, 200);

  titleRow(sh, 1, 'MEDICARE & HEALTHCARE BRIDGE',
    'Plan healthcare costs from retirement to age 65, then check your IRMAA exposure on Medicare.', C, 5);

  sectionHdr(sh, 3, 'INPUTS', C, 5);
  const mInputs = [
    ['Current Age',              "='SNAPSHOT'!B4",   '0',       false],
    ['Planned Retirement Age',   "='SNAPSHOT'!B6",   '0',       false],
    ['Filing Status',            "='SNAPSHOT'!B7",   '@',       false],
    ['Household Size',           'Self Only',        null,      true],
    ['Monthly ACA Premium Estimate (per person)', 750, '$#,##0', true],
    ['Expected MAGI in Retirement', 80000,           '$#,##0',  true],
  ];
  mInputs.forEach((row, i) => {
    const r = 4 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    if (row[3]) {
      sh.getRange(r, 2).setValue(row[1]).setBackground(C.yellow).setFontWeight('bold');
    } else {
      sh.getRange(r, 2).setFormula(row[1]).setBackground(C.lightBlue).setFontWeight('bold');
    }
    if (row[2]) sh.getRange(r, 2).setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // Household size dropdown
  sh.getRange(7, 2).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Self Only','Family (2)'], true).build()
  );

  // Healthcare bridge calcs
  sh.setRowHeight(11, 8);
  sectionHdr(sh, 12, 'HEALTHCARE BRIDGE (Before Medicare at 65)', C, 5);
  const bridgeCalcs = [
    ['Years Until Medicare (Age 65)',     '=MAX(0,65-B5)',                                        '0 "years"'],
    ['Healthcare Gap Years',              '=MAX(0,65-B5)',                                        '0 "years"'],
    ['Monthly Household Premium',         '=B8*IF(B7="Family (2)",2,1)',                          '$#,##0'],
    ['Total Bridge Cost (est.)',          '=B14*B13*12',                                          '$#,##0'],
    ['Retiring Before 65?',               '=IF(B5<65,"YES — budget "&TEXT(B15,"$#,##0")&" for healthcare before Medicare","No — Medicare ready at retirement")', null],
  ];
  bridgeCalcs.forEach((row, i) => {
    const r = 13 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold');
    if (row[2]) sh.getRange(r, 2).setNumberFormat(row[2]);
    sh.setRowHeight(r, 22);
  });

  // IRMAA section
  sh.setRowHeight(19, 8);
  sectionHdr(sh, 20, 'IRMAA SURCHARGE CALCULATOR (2025 Medicare Part B)', C, 5);
  sh.getRange(21, 1, 1, 5).merge()
    .setValue('IRMAA uses your income from 2 years prior. Working your last years = highest income = highest Medicare premiums for years 1-2 of retirement.')
    .setFontColor(C.darkGray).setFontSize(9).setFontStyle('italic').setWrap(true);
  sh.setRowHeight(21, 28);

  const irmaaCalcs = [
    ['MAGI in Retirement (from B9)',    '=B9',           '$#,##0'],
    ['Standard Part B Premium (2025)',  '185',           '$#,##0'],
    ['IRMAA Surcharge',
     '=IF(B6="Married Filing Jointly",IFS(B22<=212000,0,B22<=266000,69.90,B22<=334000,174.70,B22<=400000,279.50,B22<=750000,384.30,B22>750000,419.30),IFS(B22<=106000,0,B22<=133000,69.90,B22<=167000,174.70,B22<=200000,279.50,B22<=500000,384.30,B22>500000,419.30))',
     '$#,##0.00'],
    ['Your Monthly Part B Premium',     '=B23+B24',      '$#,##0.00'],
    ['Annual Medicare Part B Cost',     '=B25*12',       '$#,##0'],
  ];
  irmaaCalcs.forEach((row, i) => {
    const r = 22 + i;
    sh.getRange(r, 1).setValue(row[0]).setFontColor('#374151').setFontSize(10);
    sh.getRange(r, 2).setFormula(row[1]).setBackground(C.offWhite).setFontWeight('bold').setNumberFormat(row[3] || '$#,##0');
    sh.setRowHeight(r, 22);
  });

  // IRMAA status flag
  sh.getRange(27, 1, 1, 5).merge()
    .setFormula('=IF(B24=0,"✓ No IRMAA surcharge — your projected retirement income is below the threshold.",IF(B24<=69.90,"⚠ Tier 1 IRMAA — $"&TEXT(B24*12,"#,##0")&" extra per year. Consider Roth conversions now to lower future MAGI.","⚠ IRMAA Tier 2+ — $"&TEXT(B24*12,"#,##0")&" extra per year. Prioritize income reduction strategies."))')
    .setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(27, 40);
  const irmaaStatusRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('No IRMAA').setBackground(C.green).setFontColor(C.greenText).setRanges([sh.getRange(27, 1, 1, 5)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('⚠').setBackground(C.amber).setFontColor(C.amberText).setRanges([sh.getRange(27, 1, 1, 5)]).build(),
  ];
  sh.setConditionalFormatRules(irmaaStatusRules);

  // IRMAA brackets reference table
  sh.setRowHeight(29, 8);
  sectionHdr(sh, 30, '2025 IRMAA THRESHOLDS (Reference)', C, 5);
  ['MAGI Single','MAGI Married','Extra/Month','Annual Extra','Part B Total/Mo'].forEach((h, i) => {
    sh.getRange(31, i + 1).setValue(h).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
  });
  sh.setRowHeight(31, 22);
  const irmaaTable = [
    ['≤ $106,000',   '≤ $212,000',   '$0.00',    '$0',      '$185.00'],
    ['$106,001–133k', '$212,001–266k', '$69.90',  '$839',   '$254.90'],
    ['$133,001–167k', '$266,001–334k', '$174.70', '$2,096', '$359.70'],
    ['$167,001–200k', '$334,001–400k', '$279.50', '$3,354', '$464.50'],
    ['$200,001–500k', '$400,001–750k', '$384.30', '$4,612', '$569.30'],
    ['> $500,000',    '> $750,000',    '$419.30', '$5,032', '$604.30'],
  ];
  irmaaTable.forEach((row, i) => {
    const r = 32 + i;
    row.forEach((val, j) => {
      sh.getRange(r, j + 1).setValue(val).setFontSize(9).setHorizontalAlignment('center')
        .setBackground(i % 2 === 0 ? C.white : C.offWhite);
    });
    sh.setRowHeight(r, 20);
  });

  sh.setFrozenRows(2);
  lockFormulas(sh, ['B7','B8','B9']);
  sh.setTabColor(C.blue);
}

// ══════════════════════════════════════════════════════════════
// TAB: DASHBOARD (Tab 1 — first thing they see)
// Uses batch writes to avoid API quota errors after 8 heavy tabs
// ══════════════════════════════════════════════════════════════
function buildDashboardTab(sh, C) {
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 20);  sh.setColumnWidth(4, 260); sh.setColumnWidth(5, 200);

  // Title
  sh.getRange(1, 1, 1, 5).merge().setValue('THE 7-YEAR RUNWAY — RETIREMENT DASHBOARD')
    .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 40);
  sh.getRange(2, 1, 1, 5).merge()
    .setValue('Your complete retirement picture. Fill in SNAPSHOT + BALANCES tabs first.')
    .setBackground(C.lightBlue).setFontColor(C.navy).setFontSize(9).setHorizontalAlignment('center');
  sh.setRowHeight(2, 20);

  SpreadsheetApp.flush();

  // Left header
  sh.getRange(3, 1, 1, 2).merge().setValue('  YOUR NUMBERS AT A GLANCE')
    .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(10).setVerticalAlignment('middle');
  sh.setRowHeight(3, 26);

  // Right header
  sh.getRange(3, 4, 1, 2).merge().setValue("  THIS YEAR'S KEY NUMBERS")
    .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(10).setVerticalAlignment('middle');

  // Batch: left labels
  const leftLabels = [
    'Total Portfolio Today','Pre-Tax (Traditional)','Tax-Free (Roth)',
    'Taxable / Brokerage','HSA Balance','Years to Retirement',
    'Projected Portfolio at Retirement','Projected Monthly Income (4%)',
    'Monthly Expenses Needed','Savings Gap'
  ];
  sh.getRange(4, 1, leftLabels.length, 1).setValues(leftLabels.map(l => [l]))
    .setFontColor('#374151').setFontSize(10);

  // Batch: left formulas (set one at a time — formulas can't batch with setValues)
  const leftFormulas = [
    "=IFERROR('BALANCES'!D17,0)",  "=IFERROR('BALANCES'!D13,0)",
    "=IFERROR('BALANCES'!D14,0)",  "=IFERROR('BALANCES'!D15,0)",
    "=IFERROR('BALANCES'!D16,0)",  "=IFERROR('SNAPSHOT'!B20,0)",
    "=IFERROR('SNAPSHOT'!B23,0)",  "=IFERROR('SNAPSHOT'!B24,0)",
    "=IFERROR('SNAPSHOT'!B25,0)",  "=IFERROR('SNAPSHOT'!B27,0)"
  ];
  const leftFmts = ['$#,##0','$#,##0','$#,##0','$#,##0','$#,##0',
                    '0 "years"','$#,##0','$#,##0','$#,##0','$#,##0'];
  leftFormulas.forEach((f, i) => {
    sh.getRange(4 + i, 2).setFormula(f).setBackground(C.offWhite)
      .setFontWeight('bold').setFontSize(11).setNumberFormat(leftFmts[i]);
    sh.setRowHeight(4 + i, 24);
  });

  SpreadsheetApp.flush();

  // Right labels + formulas
  const rightData = [
    ['Goldilocks Roth Conversion',    "=IFERROR('GOLDILOCKS'!B23,0)",  '$#,##0'],
    ['Tax Cost of Conversion',        "=IFERROR('GOLDILOCKS'!B24,0)",  '$#,##0'],
    ['IRMAA Status',                  "=IFERROR('GOLDILOCKS'!B25,\"—\")",'@'],
    ['401k Remaining Room',           "=IFERROR('CATCHUP'!F7,0)",      '$#,##0'],
    ['IRA Remaining Room',            "=IFERROR('CATCHUP'!F8,0)",      '$#,##0'],
    ['Healthcare Bridge Years',       "=IFERROR('MEDICARE'!B13,0)",    '0 "yrs"'],
    ['Healthcare Bridge Cost',        "=IFERROR('MEDICARE'!B15,0)",    '$#,##0'],
    ['SS Break-Even Age (62 vs 70)',  "=IFERROR('SS_OPT'!B20,0)",      '0.0'],
    ['Estimated RMD at 73',          "=IFERROR('RMD'!E15,0)",          '$#,##0'],
    ['Total Tax on RMDs (73-90)',     "=IFERROR('RMD'!H33,0)",          '$#,##0'],
  ];
  sh.getRange(4, 4, rightData.length, 1).setValues(rightData.map(r => [r[0]]))
    .setFontColor('#374151').setFontSize(10);
  rightData.forEach((row, i) => {
    sh.getRange(4 + i, 5).setFormula(row[1]).setBackground(C.offWhite)
      .setFontWeight('bold').setFontSize(11).setNumberFormat(row[2]);
  });

  SpreadsheetApp.flush();

  // On Track section
  sh.setRowHeight(14, 8);
  sh.getRange(15, 1, 1, 2).merge().setValue('  AM I ON TRACK?')
    .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(10).setVerticalAlignment('middle');
  sh.setRowHeight(15, 26);
  sh.getRange(16, 1, 1, 2).merge()
    .setFormula("=IFERROR('SNAPSHOT'!B29,\"Fill in SNAPSHOT tab first\")")
    .setBackground(C.lightBlue).setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(16, 40);

  SpreadsheetApp.flush();

  // Action checklist
  sh.setRowHeight(17, 8);
  sh.getRange(18, 1, 1, 5).merge().setValue('  THIS YEAR — ACTION CHECKLIST')
    .setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setFontSize(10).setVerticalAlignment('middle');
  sh.setRowHeight(18, 26);

  const actions = [
    ['☐  Update BALANCES tab with current account values',         '→ BALANCES tab'],
    ['☐  Execute Roth conversion (see Goldilocks amount)',          '→ GOLDILOCKS tab'],
    ['☐  Max 401k + catch-up contribution by Dec 31',              '→ CATCHUP tab'],
    ['☐  Max IRA contribution by April 15',                        '→ CATCHUP tab'],
    ['☐  Review Social Security claiming strategy',                '→ SS_OPT tab'],
    ['☐  Verify IRMAA exposure for Medicare',                      '→ MEDICARE tab'],
    ['☐  Check healthcare bridge plan (if retiring before 65)',    '→ MEDICARE tab'],
    ['☐  Review withdrawal sequence for this year',                '→ WITHDRAWAL tab'],
  ];
  sh.getRange(19, 1, actions.length, 1).setValues(actions.map(a => [a[0]]))
    .setFontColor('#374151').setFontSize(10);
  sh.getRange(19, 2, actions.length, 1).setValues(actions.map(a => [a[1]]))
    .setFontColor(C.blue).setFontSize(9).setFontStyle('italic');

  SpreadsheetApp.flush();

  // Disclaimer
  sh.setRowHeight(28, 8);
  sh.getRange(29, 1, 1, 5).merge()
    .setValue('DISCLAIMER: For educational purposes only. Not financial, tax, or legal advice. Consult a qualified advisor before making decisions. Verify current IRS limits annually.')
    .setFontColor(C.darkGray).setFontSize(8).setWrap(true).setFontStyle('italic').setHorizontalAlignment('center');
  sh.setRowHeight(29, 24);

  sh.setFrozenRows(2);
  lockFormulas(sh, []);
  sh.setTabColor(C.navy);
}
