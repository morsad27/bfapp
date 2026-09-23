import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const sections = {
  about: [
    ["grewUp", "Where did you grow up?", "text"],
    ["currentCity", "What city do you live in now?", "text"],
    ["freeTime", "How do you spend your free time?", "textarea"],
  ],
  relationship: [
    ["relationshipLength", "How long have you been together with her?", "text"],
    ["longTermGoals", "What are your long-term goals?", "textarea"],
    ["fiveYears", "Where do you see your relationship in 5 years?", "textarea"],
    ["loveMost", "What do you love most about her?", "textarea"],
    ["relationshipChallenges", "What do you think are the biggest challenges in a relationship?", "textarea"],
  ],
  finance: [
    ["debtKind", "If yes, what kind?", "text"],
    ["careerPlanDetails", "If yes, what are they?", "textarea"],
  ],
  basic: [
    ["fullName", "Full Name:", "text", true],
    ["nickname", "Nickname (if any):", "text"],
    ["age", "Age:", "number"],
    ["height", "Height:", "text"],
    ["weight", "Weight:", "text"],
    ["email", "Email Address:", "email"],
    ["phone", "Phone Number:", "tel"],
    ["whereLive", "Where do you live?", "text"],
    ["city", "City:", "text"],
    ["province", "Province:", "text"],
    ["occupation", "Occupation / Job:", "text"],
    ["income", "Monthly Income:", "text"],
    ["zodiac", "Astrological sign:", "text"],
  ],
  lifestyle: [
    ["workout", "How often do you work out?", "text"],
    ["sports", "What sports do you play?", "text"],
    ["alcoholHowOften", "How often?", "text"],
  ],
  personality: [
    ["friendsDescribe", "How would your friends describe you?", "textarea"],
    ["valuesOther", "Other:", "text"],
    ["kidsNumber", "If yes, how many?", "number"],
    ["partnerValue", "What do you value most in a partner?", "textarea"],
  ],
  final: [
    ["rightPerson", "Why do you think you're the right person for her?", "textarea"],
    ["different", "What makes you different from other guys?", "textarea"],
    ["anythingElse", "Anything else you want to tell her?", "textarea"],
  ],
};

const initialForm = {};
Object.values(sections).flat().forEach(([name]) => (initialForm[name] = ""));
Object.assign(initialForm, {
  familyClose: "", parentsRelationship: "", marriageReady: "",
  savings: "", debts: "", financiallyResponsible: "", careerPlans: "",
  liveParents: "", diet: "", alcohol: "", smoke: "", gamble: "",
  believeMarriage: "", wantKids: "", values: []
});

function App() {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith("#form=")) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(hash.slice(6)))));
        setForm(decoded.form || initialForm);
        setPhoto(decoded.photo || "");
      } else {
        const saved = localStorage.getItem("boyfriendApplication");
        if (saved) {
          const data = JSON.parse(saved);
          setForm(data.form || initialForm);
          setPhoto(data.photo || "");
        }
      }
    } catch {
      setMessage("Could not load the saved form.");
    }
  }, []);

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const updateCheckbox = (name, value) => {
    setForm((prev) => {
      const current = prev[name] || [];
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const save = () => {
    localStorage.setItem("boyfriendApplication", JSON.stringify({ form, photo }));
    setMessage("Saved on this device.");
  };

  const share = async () => {
    if (!form.fullName.trim()) {
      setMessage("Please enter the Full Name first.");
      return;
    }

    const payload = btoa(
      unescape(encodeURIComponent(JSON.stringify({ form, photo })))
    );
    const url = `${window.location.origin}${window.location.pathname}#form=${payload}`;
    history.replaceState(null, "", `#form=${payload}`);

    try {
      await navigator.clipboard.writeText(url);
      setMessage("Share link copied!");
    } catch {
      window.prompt("Copy this share link:", url);
    }
  };

  const clear = () => {
    if (!window.confirm("Clear all answers and the photo?")) return;
    setForm(initialForm);
    setPhoto("");
    localStorage.removeItem("boyfriendApplication");
    history.replaceState(null, "", window.location.pathname);
    setMessage("Form cleared.");
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 500;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.72));
        setMessage("Photo added.");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const field = ([name, label, type, required]) => (
    <div className="field" key={name}>
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea value={form[name]} onChange={(e) => update(name, e.target.value)} />
      ) : (
        <input
          type={type}
          required={required}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
        />
      )}
    </div>
  );

  const radio = (name, options) => (
    <div className="choice-row">
      {options.map((option) => (
        <label className="choice" key={option}>
          <input
            type="radio"
            name={name}
            checked={form[name] === option}
            onChange={() => update(name, option)}
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <>
      <div className="toolbar">
        <button className="primary" onClick={share}>🔗 Share Filled Form</button>
        <button onClick={save}>💾 Save on This Device</button>
        <button onClick={() => window.print()}>🖨️ Print / PDF</button>
        <button onClick={clear}>↻ Clear</button>
      </div>

      <main className="paper">
        <header>
          <div className="heart">♡</div>
          <h1>CURRENT BOYFRIEND<br />APPLICATION FORM</h1>
          <p className="subtitle">
            (for my future husband, if you can't even fill this up, stop the wedding.)
          </p>
          <div className="serious">serious<br />answers<br />only, please. ♡</div>
        </header>

        <div className="layout">
          <div>
            <div className="photo-box">
              {photo ? <img src={photo} alt="Uploaded" /> : (
                <div className="photo-placeholder">
                  <span className="camera">📷</span>
                  ATTACH A RECENT<br />PHOTO OF YOURSELF<br />
                  <small>(TAKEN IN THE LAST 6 MONTHS)</small>
                </div>
              )}
            </div>
            <div className="photo-actions">
              <label className="button">Choose Photo
                <input type="file" accept="image/*" onChange={handlePhoto} hidden />
              </label>
              <button type="button" onClick={() => setPhoto("")}>Remove</button>
            </div>

            <Section title="About You">
              {sections.about.slice(0, 2).map(field)}
              <div className="inline"><span>Are you close with your family?</span>{radio("familyClose", ["Yes", "No"])}</div>
              <div className="inline"><span>What's your relationship with your parents?</span>{radio("parentsRelationship", ["Good", "Complicated", "Distant"])}</div>
              {field(sections.about[2])}
            </Section>

            <Section title="Relationship & Commitment">
              {sections.relationship.slice(0, 3).map(field)}
              <div className="inline"><span>Are you ready for marriage?</span>{radio("marriageReady", ["Yes", "No", "Maybe"])}</div>
              {sections.relationship.slice(3).map(field)}
            </Section>

            <Section title="Financial & Future Plans">
              <div className="inline"><span>Do you have a savings?</span>{radio("savings", ["Yes", "No"])}</div>
              <div className="inline"><span>Do you have any debts?</span>{radio("debts", ["Yes", "No"])}</div>
              {field(sections.finance[0])}
              <div className="inline"><span>Are you financially responsible?</span>{radio("financiallyResponsible", ["Yes", "No", "Sometimes"])}</div>
              <div className="inline"><span>Do you have plans for your career?</span>{radio("careerPlans", ["Yes", "No"])}</div>
              {field(sections.finance[1])}
            </Section>
          </div>

          <div>
            <Section title="Basic Information">
              {sections.basic.map(field)}
              <div className="inline"><span>Do you live with your parents?</span>{radio("liveParents", ["Yes", "No", "With relatives / own place"])}</div>
            </Section>

            <Section title="Lifestyle & Habits">
              {sections.lifestyle.slice(0, 2).map(field)}
              <div className="inline"><span>How would you describe your diet?</span>{radio("diet", ["Very healthy", "Mostly healthy", "Average", "Not healthy"])}</div>
              <div className="inline"><span>Do you drink alcohol?</span>{radio("alcohol", ["Yes", "No", "Sometimes"])}</div>
              {field(sections.lifestyle[2])}
              <div className="inline"><span>Do you smoke?</span>{radio("smoke", ["Yes", "No", "Sometimes"])}</div>
              <div className="inline"><span>Do you gamble?</span>{radio("gamble", ["Yes", "No", "Sometimes"])}</div>
            </Section>

            <Section title="Personality & Values">
              {field(sections.personality[0])}
              <div className="inline"><span>What are your core values? (choose at least 3)</span></div>
              <div className="check-grid">
                {["Loyalty", "Respect", "Honesty", "Family", "Communication", "Kindness", "Ambition"].map((value) => (
                  <label key={value}><input type="checkbox" checked={form.values.includes(value)} onChange={() => updateCheckbox("values", value)} /> {value}</label>
                ))}
              </div>
              {field(sections.personality[1])}
              <div className="inline"><span>Do you believe in marriage?</span>{radio("believeMarriage", ["Yes", "No", "Maybe"])}</div>
              <div className="inline"><span>Do you want kids?</span>{radio("wantKids", ["Yes", "No", "Maybe"])}</div>
              {sections.personality.slice(2).map(field)}
            </Section>

            <Section title="Final Questions">
              {sections.final.map(field)}
            </Section>
          </div>
        </div>

        <div className="footer-warning">
          IF YOU CAN'T FILL THIS OUT HONESTLY AND COMPLETELY...<br />
          <span>STOP THE WEDDING.</span>
        </div>
        <div className="saved">{message}</div>
      </main>
    </>
  );
}

function Section({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>;
}

createRoot(document.getElementById("root")).render(<App />);
