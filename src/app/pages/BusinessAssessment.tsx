import Contact from "../components/Contact";
import { useSite } from "../../content/context";
const questions = [
  { name: "assessmentWebsite", title: "Website & online presence", question: "Does your website clearly explain your services and generate customer inquiries?", options: ["Yes, it works well", "Somewhat, it needs improvement", "No, or we don't have a website"] },
  { name: "assessmentLeads", title: "Customer management", question: "Can your team track new inquiries, customer conversations and follow-ups in one place?", options: ["Yes, in a dedicated system", "Partially, across multiple tools", "No, mostly manually"] },
  { name: "assessmentScheduling", title: "Appointments & requests", question: "Can customers request services, appointments or estimates online?", options: ["Yes, with a smooth process", "Only by email or basic form", "No, mostly by phone"] },
  { name: "assessmentWorkflow", title: "Daily workflows", question: "How much of your repetitive paperwork, data entry and follow-up is automated?", options: ["Most recurring work", "Some recurring work", "Very little or none"] },
  { name: "assessmentReporting", title: "Business visibility", question: "Can you quickly see the numbers and operational information needed to run your business?", options: ["Yes, in dashboards or reports", "Somewhat, with manual effort", "No, information is scattered"] },
  { name: "assessmentSystems", title: "Connected systems", question: "Do your main business systems share information without repeated manual entry?", options: ["Yes, well integrated", "A few systems connect", "No, mostly disconnected"] },
  { name: "assessmentMarketing", title: "Marketing & follow-up", question: "Do you have a consistent way to reach prospects and keep in touch with customers?", options: ["Yes, with planned campaigns", "Sometimes, when time allows", "No consistent process"] },
  { name: "assessmentAI", title: "Practical AI", question: "Are you currently using AI tools to save time on business tasks?", options: ["Yes, routinely", "Experimenting or exploring", "No, not yet"] },
] as const;
export default function BusinessAssessment() {
 const { formToken } = useSite();
 return <>
  <section className="page-intro assessment-intro" id="top"><div className="container">
   <p className="eyebrow">Free business technology assessment</p>
   <h1>Less busywork.<br/><em>More room to grow.</em></h1>
   <p>Tell us how your business works today. We'll review your answers and identify practical opportunities for better websites, connected systems and automation. No obligation, no technical knowledge needed.</p>
   <div className="assessment-meta"><span>About 3–5 minutes</span><span>Free, personal review</span><span>Southern Wisconsin &amp; Northern Illinois</span></div>
  </div></section>
  <section className="section assessment-section"><div className="container assessment-layout">
  <div className="assessment-sidebar"><p className="eyebrow">What happens next?</p><h2>A useful starting point.</h2><p>We read each submission, look for practical improvements, and follow up with ideas that fit your business—not a generic sales pitch.</p><ol><li>Tell us about your business.</li><li>Review eight everyday technology questions.</li><li>Describe your biggest challenge and submit.</li></ol><p className="assessment-small">Your information is used to respond to your assessment. We won't add you to a marketing list unless you separately agree.</p></div>
  <form className="inquiry-form assessment-form" action="/api/inquiries" method="post" data-inquiry-form="">
   <input type="hidden" name="formToken" value={formToken}/><input type="hidden" name="service" value="Business Technology Assessment"/>
   <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <fieldset><legend><span className="assessment-step">01 /</span> Tell us about your business</legend>
    <div className="form-row"><label htmlFor="assess-business">Business name<input id="assess-business" name="business" autoComplete="organization" required maxLength={160}/></label>
    <label htmlFor="assess-name">Your name<input id="assess-name" name="name" autoComplete="name" required maxLength={120}/></label></div>
    <div className="form-row"><label htmlFor="assess-email">Email address<input id="assess-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label htmlFor="assess-phone">Phone (optional)<input id="assess-phone" name="phone" type="tel" autoComplete="tel" maxLength={40}/></label></div>
    <div className="form-row"><label htmlFor="assess-industry">Industry<select id="assess-industry" name="assessmentIndustry" required defaultValue=""><option value="" disabled>Select your industry</option>{["Construction & trades","Automotive & repair","Retail & hospitality","Professional services","Healthcare & wellness","Real estate","Manufacturing & logistics","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label htmlFor="assess-size">Business size<select id="assess-size" name="assessmentSize" required defaultValue=""><option value="" disabled>Number of employees</option>{["Just me","2–10","11–50","51–200","200+"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   </fieldset>
   <fieldset><legend><span className="assessment-step">02 /</span> How does your business work today?</legend>
    <p className="assessment-hint">Select the answer that best matches your current situation.</p>
    {questions.map((item,index)=><div className="assessment-question" key={item.name}><p className="assessment-question-label">{String(index+1).padStart(2,"0")} · {item.title}</p><label htmlFor={item.name}>{item.question}<select id={item.name} name={item.name} required defaultValue=""><option value="" disabled>Choose an answer</option>{item.options.map(x=><option key={x} value={x}>{x}</option>)}</select></label></div>)}
   </fieldset>
   <fieldset><legend><span className="assessment-step">03 /</span> What would make the biggest difference?</legend>
    <label htmlFor="assess-challenge">Tell us about the tasks, frustrations or goals you would most like to improve<textarea id="assess-challenge" name="assessmentChallenge" rows={5} required minLength={10} maxLength={2000} placeholder="For example: We spend hours manually following up with customers, and our systems don't communicate."/></label>
    <label htmlFor="assess-timing">When would you like to explore improvements?<select id="assess-timing" name="assessmentTiming" defaultValue="Just exploring">{["Just exploring","Within the next month","Within 1–3 months","Later this year"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="assessment-consent"><input type="checkbox" name="assessmentConsent" value="yes" required/> I understand Sixteen Oaks will use my information to review this assessment and contact me about my request.</label>
   </fieldset>
   <button className="button" type="submit">Submit my free assessment <span aria-hidden="true">→</span></button>
   <p className="form-status" role="status" aria-live="polite"/>
   <p className="form-privacy">No obligation. We do not ask for passwords or confidential business records.</p>
  </form></div></section>
  <Contact/>
 </>;
}
