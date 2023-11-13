let empName = document.getElementById("name");
let position = document.getElementById("position");
let inputSalary = document.querySelectorAll('#inputSalary input');
let department = document.getElementById("department");
let count = document.getElementById("count");
let tbody = document.getElementById("tbody");
let createBtn = document.getElementById("createBtn");
let deleteAllBtn = document.getElementById("deleteAllBtn");
let spanCounterTask = document.getElementById('spanCounterTask');
let model = document.getElementById("model");
let spanValidationMessage = document.querySelectorAll("#spanValidationMessage");
let inputs = document.querySelectorAll("input");
let validationMessage = document.getElementById("validationMessage");
let mood = "create";
let GlobalId;
let validationError = false;
let employees;
if (localStorage.employees == null) {
    employees = [];
} else {
    employees = JSON.parse(localStorage.employees);
}
// Validation Data String All inputs
let ckeckValidation = () => {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length <= 0) {
            validationError = false;
            spanValidationMessage[i].style.display = 'block'
            inputs[i].style.border = '1px solid red';
        } else {
            validationError = true;
            spanValidationMessage[i].style.display = 'none'
        }
    }

}
for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.length <= 0) {
        validationError = false;
        // spanValidationMessage[i].style.display = 'block'
    } else {
        validationError = true;
        // spanValidationMessage[i].style.display = 'none'
    }
    inputs[i].addEventListener('keyup', function () {
        if (inputs[i].value == '') {
            validationError = false;
            inputs[i].style.border = '1px solid red';
            spanValidationMessage[i].style.display = 'block'
        } else {
            validationError = true;
            inputs[i].style.border = '1px solid green';
            spanValidationMessage[i].style.display = 'none'
        }
    });

}


// Validation number
let ckeckValidationNumber = () => {
    for (let i = 0; i < inputSalary.length; i++) {
        if (parseFloat(inputSalary[i].value) < 0 || typeof (parseFloat(inputSalary[i].value)) != 'number') {
            validationError = false;
        }
    }
}







// Get Span Counter 
let spanCounterTaskLinght = () => {
    spanCounterTask.innerHTML = employees.length;
}

// Check if You Hava Any Task
let checkIfEmptyTasks = () => {
    if (tbody.childElementCount == 0 || localStorage.length == 0 || employees.length == 0) {
        deleteAllBtn.classList.add("none");
    } else {
        deleteAllBtn.classList.remove("none");
    }

}
// To clear Input Data
let RestFunction = () => {
    empName.value = ""
    position.value = ""
    inputSalary[0].value = ""
    inputSalary[1].value = ""
    inputSalary[2].value = ""
    inputSalary[3].value = ""
    inputSalary[4].value = ""
    department.value = ""
    count.value = ""
}
checkIfEmptyTasks();
spanCounterTaskLinght();
// Function Get Salary 
let getSalary = () => {
    let gross = inputSalary[0].value;
    let tax = inputSalary[1].value;
    let tranCost = inputSalary[2].value;
    let bouns = inputSalary[3].value;

    let TaxCost = +gross * (tax / 100);
    let salaryAfterTax = +gross - +TaxCost;
    let salaryAfterTranCost = +salaryAfterTax - +tranCost;
    let netSalary = +salaryAfterTranCost + +bouns;
    inputSalary[4].value = Math.ceil(+netSalary);

}
// Event Input
for (let index = 0; index < inputSalary.length; index++) {
    inputSalary[index].addEventListener("keyup", getSalary);
}



// Create employees Object
let createObject = () => {
    // Valid
    let newEmployee = {
        empName: empName.value,
        position: position.value,
        gross: inputSalary[0].value,
        tax: inputSalary[1].value,
        tranCost: inputSalary[2].value,
        bouns: inputSalary[3].value,
        total: inputSalary[4].value,
        department: department.value,
        count: count.value
    }

    ckeckValidation();
    ckeckValidationNumber();

    if (validationError == true) {

        if (mood == "create") {
            if (newEmployee.count <= 1) {
                employees.push(newEmployee);
            } else {
                for (let x = 0; x < newEmployee.count; x++) {
                    employees.push(newEmployee);
                }
            }
        } else {
            employees[GlobalId] = newEmployee;
            mood = 'create';
            count.classList.remove("none");
            createBtn.innerHTML = `Create Neew Employees`;
            createBtn.classList.replace("btn-warning", "btn-info");
        }



        localStorage.setItem("employees", JSON.stringify(employees));
        showData();
        spanCounterTaskLinght();
        RestFunction();
        checkIfEmptyTasks();


    }



}
// create Element 
createBtn.addEventListener("click", createObject);


// Show Data in Table
let showData = () => {
    let tableRow = '';
    for (let i = 0; i < employees.length; i++) {
        tableRow += `
        <tr>
        <td> ${i + 1}   </td>
        <td> ${employees[i].empName}   </td>
        <td> <i onclick="showOneItem(${i})"   class="text-primary fa-solid fa-eye"></i></td>
        <td> <i onclick="removeOneItem(${i})" class="text-danger fa-solid fa-trash-can"></i>  </td>
        <td> <i onclick="updateOneItem(${i})" class="text-warning fa-solid fa-pen-to-square"></i> </td>
        </tr>
        `
    }
    tbody.innerHTML = tableRow;
    checkIfEmptyTasks();
}
showData();

// Remove all Data From Table
let removeAllData = () => {
    localStorage.clear();
    employees.splice(0);
    showData();
    spanCounterTaskLinght();
    checkIfEmptyTasks();
}


// Remove One Item 
let removeOneItem = (i) => {
    if (confirm("are You Sure")) {
        employees.splice(i, 1);
        localStorage.employees = JSON.stringify(employees);
        showData();
    }

}

// Update Employee Data By ID
let updateOneItem = (i) => {
    mood = "update";

    empName.value = employees[i].empName;
    position.value = employees[i].position;
    inputSalary[0].value = employees[i].gross;
    inputSalary[1].value = employees[i].tax;
    inputSalary[2].value = employees[i].tranCost;
    inputSalary[3].value = employees[i].bouns;
    inputSalary[4].value = employees[i].total;
    department.value = employees[i].department;

    GlobalId = i;
    count.classList.add("none");
    createBtn.innerHTML = `Update Employee Number : ${i + 1}`;
    createBtn.classList.replace("btn-info", "btn-warning");
}

// Show One Item

let showOneItem = (i) => {
    model.style.display = 'flex';
    model.innerHTML = `
    <div class="col-md-5">
    <div class="card">
      <div class="card-header">
      ${employees[i].empName} <i onclick="closeModel()" class="fa-solid fa-rectangle-xmark"></i>
      </div>
      <div class="card-body">
        <h5 class="card-title"> Employee :  ${employees[i].empName}  </h5>
  Name :  ${employees[i].empName}
   <hr>
 Posistion :${employees[i].position}
 <hr>
  Gross Salary :     ${employees[i].gross}
      <hr>
   Tax Cost :   ${employees[i].tax}
    <hr>
  TranCost :  ${employees[i].tranCost}
  <hr>
 Bouns :  ${employees[i].bouns}
   <hr>
     Total :   ${employees[i].total}
        <hr>
  Department : ${employees[i].department}
 <hr>
      </div>
    </div>
  </div>
    
    `;
}
// Close mode show Item
let closeModel = () => {
    model.style.display = "none";
}

model.addEventListener("click", closeModel);
deleteAllBtn.addEventListener("click", removeAllData);


