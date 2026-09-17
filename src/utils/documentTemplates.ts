import { DocumentGenerationData } from '../types';

export function getOfferLetterContent(data: DocumentGenerationData): string {
  return `
COMPANY OFFER OF EMPLOYMENT

Date: ${data.signDate || new Date().toISOString().split('T')[0]}

To:
${data.recipientName}
${data.recipientAddress || 'Employee Address on File'}
Email: ${data.recipientEmail}
Phone: ${data.recipientPhone}

Dear ${data.recipientName},

On behalf of ${data.companyName}, we are pleased to extend this formal offer of employment for the position of ${data.positionTitle} within our ${data.department} team. We were exceptionally impressed by your professional qualifications, experience, and commitment to excellence.

1. POSITION AND REPORTING
You will serve as ${data.positionTitle}, reporting directly to ${data.reportingManager || 'the Department Head'}, based at ${data.workLocation || 'Company Headquarters / Hybrid'}.

2. COMMENCEMENT AND JOINING DATE
Your employment will commence on ${data.joiningDate} ("Effective Joining Date").

3. COMPENSATION AND BENEFITS
- Base Compensation: $${data.baseSalary.toLocaleString()} per ${data.salaryFrequency.toLowerCase()}, subject to standard statutory tax withholdings.
- Health & Wellness: Comprehensive Medical, Dental, and Vision coverage for you and eligible dependents.
- Retirement: 401(k) retirement savings plan with discretionary company matching contributions.
- Paid Time Off: Generous annual paid vacation, sick leave, and standard company holidays.

4. PROBATIONARY PERIOD
This offer is subject to a standard introductory probationary period of ${data.probationMonths} months from your joining date, during which performance and fit will be evaluated.

5. ACCEPTANCE OF OFFER
To confirm your acceptance of this offer, please sign and date this document and return it to Human Resources no later than 5 business days from receipt.

${data.customTerms ? `\nADDITIONAL TERMS:\n${data.customTerms}\n` : ''}

Sincerely,

_______________________________
${data.signeeName}
${data.signeeTitle}
${data.companyName}


CANDIDATE ACCEPTANCE
I, ${data.recipientName}, accept the offer of employment as outlined above.

Signature: ___________________________    Date: ______________
`.trim();
}

export function getAppointmentLetterContent(data: DocumentGenerationData): string {
  return `
APPOINTMENT LETTER & CONTRACT OF EMPLOYMENT

Reference: APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}
Date: ${data.signDate || new Date().toISOString().split('T')[0]}

To:
${data.recipientName}
${data.recipientAddress || 'Candidate Address'}

Subject: Formal Appointment as ${data.positionTitle}

Dear ${data.recipientName},

With reference to your interview and acceptance of our offer, the Management of ${data.companyName} is pleased to formally appoint you to the position of ${data.positionTitle} in the ${data.department} Department under the following contractual terms and conditions:

1. COMMENCEMENT OF APPOINTMENT
Your appointment takes effect from your official date of joining on ${data.joiningDate}.

2. PROBATIONARY EVALUATION
You will be placed on probation for an initial duration of ${data.probationMonths} months. Upon satisfactory review of your performance and conduct, your services will be confirmed in writing. Management reserves the right to extend the probationary period if deemed necessary.

3. REMUNERATION AND TAX WITHHOLDINGS
Your gross remuneration is fixed at $${data.baseSalary.toLocaleString()} per ${data.salaryFrequency.toLowerCase()}. All compensation is disbursed through direct payroll deposit in compliance with statutory federal, state, Social Security, and Medicare withholdings.

4. DUTIES & RESPONSIBILITIES
You agree to devote your full business time, skill, and attention exclusively to the business and interests of ${data.companyName}. You shall diligently execute all duties customary to your office and comply with all company workplace policies.

5. TERMINATION AND NOTICE PERIOD
During the probationary period, either party may terminate this agreement by giving 14 calendar days' written notice. Following confirmation, the required notice period for termination without cause by either party shall be ${data.noticePeriodDays} days or salary in lieu thereof.

6. CODE OF CONDUCT & CONFIDENTIALITY
You shall strictly safeguard all business records, customer data, and trade secrets of ${data.companyName}. Any breach of confidentiality constitutes grounds for immediate termination for cause.

${data.customTerms ? `\nSPECIAL PROVISIONS:\n${data.customTerms}\n` : ''}

We welcome you warmly to ${data.companyName} and look forward to a rewarding and long-standing professional association.

For and on behalf of ${data.companyName}:

_______________________________
Authorized Signatory: ${data.signeeName}
Designation: ${data.signeeTitle}


ACKNOWLEDGMENT & DECLARATION
I, ${data.recipientName}, hereby acknowledge receipt of this Appointment Letter and confirm my full acceptance of the terms and conditions outlined herein.

Employee Signature: ___________________________    Date: ______________
`.trim();
}

export function getNDAPaperContent(data: DocumentGenerationData): string {
  return `
EMPLOYEE NON-DISCLOSURE AND PROPRIETARY INFORMATION AGREEMENT

This Non-Disclosure Agreement ("Agreement") is executed on this ${data.signDate || new Date().toISOString().split('T')[0]}, by and between:

DISCLOSING PARTY:
${data.companyName}, having its principal business address at ${data.companyAddress || '100 Enterprise Way, Suite 400'} ("Company"),

AND

RECEIVING PARTY / EMPLOYEE:
${data.recipientName}, residing at ${data.recipientAddress || 'Residential Address on File'} ("Employee").

RECITALS
WHEREAS, in connection with Employee's engagement as ${data.positionTitle} commencing on or about ${data.joiningDate}, Employee will have access to non-public, proprietary, and confidential business, technical, financial, and personnel information of the Company.

NOW, THEREFORE, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" includes, without limitation, all software, algorithms, source code, payroll and employee records, pricing structures, client lists, customer information, trade secrets, business models, financial data, and technical specifications disclosed verbally, in writing, or via electronic transmission.

2. OBLIGATIONS OF NON-DISCLOSURE
Employee agrees to:
(a) Hold all Confidential Information in strict trust and confidence;
(b) Not disclose, publish, or reveal any Confidential Information to any third party without prior written authorization from Company;
(c) Use such Confidential Information exclusively for performing authorized work within the scope of employment with Company;
(d) Take all reasonable precautions to prevent unauthorized disclosure, leakage, or misappropriation.

3. INTELLECTUAL PROPERTY ASSIGNMENT
All inventions, designs, copyrightable materials, software, and works of authorship conceived, developed, or reduced to practice by Employee during the course of employment shall remain the sole and exclusive property of ${data.companyName} as "work made for hire."

4. NON-SOLICITATION COVENANTS
During employment and for a period of twelve (12) months following termination of employment for any reason, Employee shall not directly or indirectly solicit, induce, or encourage any employee, contractor, or client of the Company to terminate their relationship with the Company.

5. RETURN OF COMPANY PROPERTY
Upon termination of employment or upon written request, Employee shall promptly return all documents, equipment, laptops, digital media, credentials, and data belonging to the Company without retaining copies.

6. TERM AND SURVIVAL
The confidentiality obligations under this Agreement shall survive the termination of employment and remain in full force and effect for a period of five (5) years, except for trade secrets, which shall be protected indefinitely under applicable law.

7. GOVERNING LAW AND REMEDIES
This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction of the Company's principal office. Employee acknowledges that any breach may cause irreparable harm for which monetary damages alone would be inadequate, entitling the Company to seek injunctive relief.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY: ${data.companyName}

By: _______________________________
Name: ${data.signeeName}
Title: ${data.signeeTitle}
Date: ${data.signDate}


EMPLOYEE:
Signature: ___________________________
Name: ${data.recipientName}
Title: ${data.positionTitle}
Date: _______________________________
`.trim();
}
