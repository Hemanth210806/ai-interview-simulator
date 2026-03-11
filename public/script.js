// ===============================
// REGISTER USER
// ===============================
async function register(){

  const fullname = document.getElementById("regName").value;
  const usn = document.getElementById("regUSN").value;
  const password = document.getElementById("regPassword").value;

  try{

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        fullname,
        usn,
        password
      })
    });

    const data = await res.json();

    alert(data.message || data.error);

  }catch(err){
    console.log("Register error:",err);
  }

}



// ===============================
// LOGIN USER
// ===============================
async function login(){

  const usn = document.getElementById("loginUSN").value;
  const password = document.getElementById("loginPassword").value;

  try{

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        usn,
        password
      })
    });

    const data = await res.json();

    if(data.message){

      // Save user info locally
      localStorage.setItem("usn",data.user.usn);
      localStorage.setItem("name",data.user.fullname);

      window.location.href="/dashboard.html";

    }else{

      alert(data.error);

    }

  }catch(err){
    console.log("Login error:",err);
  }

}



// ===============================
// GET COMPANIES FROM AI
// ===============================
async function getCompanies(){

  const pkg = document.getElementById("package").value;

  try{

    const res = await fetch("/api/student/companies",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        package:pkg
      })
    });

    const data = await res.json();

    const companySelect = document.getElementById("company");

    companySelect.innerHTML="";

    const companies = data.companies.split("\n");

    companies.forEach(c=>{

      if(c.trim()!==""){

        const option = document.createElement("option");

        option.value=c.trim();
        option.text=c.trim();

        companySelect.appendChild(option);

      }

    });

  }
  catch(err){
    console.log("Company load error:",err);
  }

}



// ===============================
// GET QUESTIONS
// ===============================
async function getQuestions(){

  const company = document.getElementById("company").value;

  if(!company){
    alert("Please select a company first");
    return;
  }

  try{

    const res = await fetch("/api/student/questions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        company
      })
    });

    const data = await res.json();

    document.getElementById("questions").innerText = data.questions;

  }
  catch(err){
    console.log("Question error:",err);
  }

}



// ===============================
// EVALUATE ANSWER + STORE RESULT
// ===============================
async function evaluateAnswer(){

  const question = document.getElementById("questions").innerText.trim();
  const answer = document.getElementById("answer").value.trim();

  const usn = localStorage.getItem("usn");

  if(!question){
    alert("Generate questions first");
    return;
  }

  if(!answer){
    alert("Please type your answer");
    return;
  }

  try{

    const res = await fetch("/api/student/evaluate",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        question,
        answer,
        usn
      })
    });

    const data = await res.json();

    console.log("Evaluation:",data);

    if(data.evaluation){

      document.getElementById("feedback").innerText=data.evaluation;

    }else{

      document.getElementById("feedback").innerText="AI could not evaluate the answer.";

    }

  }
  catch(err){

    console.log("Evaluation error:",err);

    document.getElementById("feedback").innerText="Error evaluating answer.";

  }

}