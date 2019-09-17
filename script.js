// declare global variable
let numOfPendingTodo = 0;
let numOfDoneTodo = 0;
let maxNumOfPendingTodo = 20;
let editCount = 0;

// declare object todo
let todo = {
  tasks: [],
  lists: [],
  addTask: function(input,listName) {
    let task = {
        id: 'task_' + Date.now(),
      description: input,
      isDone: false,
      list: listName
    };
    this.tasks.push(task);
    db.collection("tasks").add({id:'task_' + Date.now(),description: input, isDone: false, list: listName});
    return task;
  },
  addList: function(input) {
    let list = {
        id: 'list_' + Date.now(),
        listName: input,
        numOfTask: 0,
        isArchive: false
    };
    this.lists.push(list);
    db.collection("lists").add({id:'list_' + Date.now(),listname: input, numOfTask: 0, isArchive: false});
    return list;
  }
};

// Initialize Cloud Firestore through Firebase
// TODO: add the firebase initialisation logic here:
var firebaseConfig = {
    apiKey: "AIzaSyCoe5tFHO4R-OHm2Ebh41EAEeu4fgHaTBg",
    authDomain: "todoapp-96721.firebaseapp.com",
    databaseURL: "https://todoapp-96721.firebaseio.com",
    projectId: "todoapp-96721",
    storageBucket: "todoapp-96721.appspot.com",
    messagingSenderId: "401809533763",
    appId: "1:401809533763:web:8b50e64a67638ceefaddf6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
// Create an instance of our DB
var db = firebase.firestore();

db.collection("tasks").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderTask(doc.data());
    })
})

// db.collection("tasks").onSnapshot(function(snapshot) {
//     tasks = {}
//     snapshot.forEach(function(doc) {
//         tasks[doc.id] = doc.data();
//     });
//     console.log(tasks);
    
// });

db.collection("lists").onSnapshot(function(snapshot) {
    let lists = {}
    snapshot.forEach(function(doc) {
        lists[doc.id] = doc.data();
    });
    console.log(lists);
    
});

function createListDiv(list) {
    let listWrapper = ` 
    <div id="${list.id}" class="list-item"><span class="list-name">${list.listName}</span>
    <span class="float-right num-task">${list.numOfTask}</span>
    </div>`
    $("#todoLists").append(listWrapper);
};


// add new list
$("#addList").click(function(event) {
    event.preventDefault();
    let newListName = $("#todoListName").val();
    let list = todo.addList(newListName);
    createListDiv(list);
    switchTodoList(newListName);
    $("#todoListName").val("");
});

// switch between different todos
function switchTodoList(listName) {
    $("#todo-body").html("");
    $("#todo-title").html(listName);
    let currentList = listName;
    let itemsInTodo ="";
    let numTask = $("#todoLists").find($(`.list-name:contains(${currentList})`)).next().text();
    console.log(numTask);
    if (numTask == 0) {
    $("#todo-body").append(`<h3 class="text-secondary text-center">This list is currently empty. <br/>Add some items :)</h3>`);
    } else {
        for (i = 0; i < todo.tasks.length; i++ ) {
            if(todo.tasks[i].list === listName) {
                itemsInTodo += `
                <div id="${todo.tasks[i].id}" class="custom-control custom-checkbox task-item">
                    <div class="task-container">
                        <input type="checkbox" class="custom-control-input" id="item_${i}">
                        <label class="custom-control-label" for="item_${i}"><span>${todo.tasks[i].description}</span></label>
                        <div class="task-action"><i data-feather="edit-2"></i>
                        <i data-feather="trash-2"></i></div>
                    </div>
                </div>`
            }
        }   
        $("#todo-body").append(itemsInTodo);
        feather.replace();
        updateTodoCounter();
    }
}

$(document).on("click", ".list-item", function() {
    let listName = $(this).children().html();
    switchTodoList(listName);
});

function createTaskDiv(task) {
    let taskWrapper = `
    <div id="${task.id}" class="custom-control custom-checkbox task-item">
        <div class="task-container">
            <input type="checkbox" class="custom-control-input" id="${todo.tasks.length}">
            <label class="custom-control-label" for="${todo.tasks.length}"><span>${task.description}</span></label>
            <div class="task-action"><i data-feather="edit-2"></i>
            <i data-feather="trash-2"></i></div>
        </div>
    </div>`
    $("#todo-body").append(taskWrapper);
}

// add task
$("#addTask").click(function(event) {
  event.preventDefault();

  let taskDescription = $("#taskDescription").val();
  $(".invalid-feedback").css("visibility", "hidden");
  $("#taskDescription").removeClass("is-invalid");

  let isError = catchInvalidInput(taskDescription);
  let listName = $("#todo-title").text();
  
  if (taskDescription.length > 0 && isError === true) {
  
    let task = todo.addTask(taskDescription, listName);
    createTaskDiv(task);
    updateTodoCounter();
    feather.replace();
  }
  $("#taskDescription").val("");
});

// catch invalid input
function catchInvalidInput(taskDescription) {
    try {
        if (taskDescription.length === 0 || taskDescription === " ") {
            throw "Can't add an empty item..duhhh";
        }
        if (numOfPendingTodo > maxNumOfPendingTodo) {
            throw "You have too many pending todos. Finish some first!"
        }
    }
    catch(err) {
        console.log(err);
        $(".invalid-feedback").html(err);
        $("#taskDescription").addClass("is-invalid");
        $(".invalid-feedback").css("visibility", "visible");
        return false;
    }
    return true;
}

// click to delete
$(document).on("click", ".feather-trash-2", function() {
  let taskId = $(this).closest(".task-item").attr('id');
  let index = todo.tasks.findIndex(task => task.id === taskId);

  todo.tasks.splice(index, 1);
  updateTodoCounter();
  $(this).closest(".task-item").remove();
});

// Edit todo item
$(document).on("click", ".feather-edit-2", function() {
    if (editCount === 0) {  
    let currentVal = $(this).closest(".task-item").find("span").text();
    let editWrapper = `
    <div class="edit-container">
        <form>
            <div class="form-row">
                <div class="col-9">
                    <input type="text" id="editDescription" class="form-control" placeholder="${currentVal}" aria-label="edit-description" aria-describedby="edit-task" required>
                    <div class="invalid-feedback">
                        This item already exist in the list!
                    </div>
                </div>
                <div class="col-3 text-right">
                    <button id="save" type="submit" class="btn btn-outline-secondary">Save</button> 
                    <button id="cancel" class="btn btn-outline-secondary">Cancel</button>
                </div>
            </div>
        </form>
    </div>
    `;
    $(this).closest(".task-item").append(editWrapper);
    $(this).closest(".task-container").css("display","none");
    }
    editCount = 1;
});


// save changes
$(document).on("click", "#save", function() {
    event.preventDefault();
    let currentVal = $(this).closest(".task-item").find("span").text(); 
    let newVal = $("#editDescription").val();
    
    for (i=0; i < todo.tasks.length; i++) {
        if (todo.tasks[i].description === newVal) {
            $("#editDescription").addClass("is-invalid");
            throw "This task already exist";        
        }
    }

    if (newVal.length = 0) {
        $(this).closest(".task-item").find("span").text(currentVal);
    } else if (newVal != " " && newVal.length > 0) {
    let index = todo.tasks.findIndex(task => task.description === currentVal);
    todo.tasks[index].description = newVal;
    $(this).closest(".task-item").find("span").text(newVal);
    }
    $(this).parents().find(".task-container").css("display","block");
    $(this).closest(".edit-container").remove();
    editCount = 0;
});

// cancel changes
$(document).on("click", "#cancel", function() {
    $(this).parents().find(".task-container").css("display","block");
    $(this).closest(".edit-container").remove();
    editCount = 0;
});

// check / uncheck complete
$(document).on("change", ":checkbox", function() {
    let taskId = $(this).closest(".task-item").attr('id');
    let index = todo.tasks.findIndex(task => task.id === taskId);

  if (this.checked) {
    todo.tasks[index].isDone = true;
    $(this).parent().find(".feather-edit-2").css("visibility", "hidden");
    updateTodoCounter();
  } else {
    todo.tasks[index].isDone = false;
    $(this).parent().find(".feather-edit-2").css("visibility", "visible");
    updateTodoCounter();
  }
  $(this).parent().toggleClass("completed");
});

// update counter
function updateTodoCounter() {
    
    // update number of todo items for each list
    $('#todoLists > div').each(function() {
        let listName = $(this).find(".list-name").text();

        for (i=0; i < todo.lists.length; i++) {
            if (listName === todo.lists[i].listName) {
                $(this).find('.num-task').text(todo.lists[i].numOfTask);
            }    
        }
    });

    //Assign value to Number of pending todo & number of Completed todo
    let currentList = $("#todo-title").text();
    let taskInCurrentList = todo.tasks.filter(task => task.list === currentList); 
    let doneTodoInCurrentList = taskInCurrentList.filter(task => task.isDone === true);
    
    numOfDoneTodo = doneTodoInCurrentList.length;
    numOfPendingTodo = taskInCurrentList.length - numOfDoneTodo;

    for (i=0; i < todo.lists.length; i++) {
        if (todo.lists[i].listName === currentList) {
            todo.lists[i].numOfTask = numOfPendingTodo;
        }
    }
    $("#todoLists").find($(`.list-name:contains(${currentList})`)).next().text(numOfPendingTodo);

  // Display empty state
    if (taskInCurrentList.length > 0) {
        $("#todo-body").find("h3").addClass("d-none");
    } else {
        $("#todo-body").find("h3").removeClass("d-none");
    }


  if (numOfPendingTodo === 1 || numOfPendingTodo === 0) {
    $("#numberTodo").html(`${numOfPendingTodo} todo item`);
  } else {
  $("#numberTodo").html(`${numOfPendingTodo} todo items`);
  }
  $("#clearComplete").html(`Clear completed [${numOfDoneTodo}]`);

  // hide "Hide completed items" & "Clear completed" if no completed items.
  if(numOfDoneTodo > 0) {
      $("#clearComplete").css("visibility","visible" );
      $("#hideComplete").css("visibility","visible" );
  } else {
    $("#clearComplete").css("visibility","hidden" );
    $("#hideComplete").css("visibility","hidden" );
  }
  return numOfDoneTodo, numOfPendingTodo;
}

function toggleCompleteTodo() {
    $("#todo-body").find(".completed").parent().toggleClass("d-none");
    if ($("#todo-body").find(".completed").parent().hasClass("d-none")) {
        $("#hideComplete").text("Show completed");
    } else {
        $("#hideComplete").text("Hide completed");
    }
};

// toggle show hide complete
$("#hideComplete").click(function() {
    toggleCompleteTodo()
});
  
// clear complete
$("#clearComplete").click(function() {
    let i = 0;
    while(i < todo.tasks.length) {
        if(todo.tasks[i].isDone === true) {
            todo.tasks.splice(i, 1);
        } else {
        i++;
    }
    updateTodoCounter();
    $("#todo-body").find(".completed").parent().remove();
    }
});

// add default todo list
todo.addList("My Todo List");

