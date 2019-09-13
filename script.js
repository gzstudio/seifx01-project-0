let numOfPendingTodo = 0;
let numOfDoneTodo = 0;
let editCount = 0;

// declare object todo
const todo = {
  tasks: [],
  lists: [],
  completedTasks: [],
  addTask: function(input,listName) {
    let task = {
      description: input,
      isDone: false,
      listName: listName
    };
    this.tasks.push(task);
  }
};

// add list

// add task
$(`#addTask`).click(function(event) {
  event.preventDefault();
  let taskDescription = $("#taskDescription").val();

  $(".invalid-feedback").css("visibility", "hidden");
  $("#taskDescription").removeClass("is-invalid");

  let isError = catchInvalidInput(taskDescription);
  if (taskDescription.length > 0 && isError === true) {
    todo.addTask($("#taskDescription").val());
    let taskWrapper = `
        <div id="taskWrapper-${todo.tasks.length}" class="custom-control custom-checkbox task-item">
            <div class="task-container">
                <input type="checkbox" class="custom-control-input" id="task-${todo.tasks.length}">
                <label class="custom-control-label" for="task-${todo.tasks.length}"><span>${taskDescription}</span></label>
                <div class="task-action"><i data-feather="edit-2"></i>
                <i data-feather="trash-2"></i></div>
            </div>
        </div>`;
    $("#todo-body").append(taskWrapper);
    updateTodoCounter();
    feather.replace();
  }
  $("#taskDescription").val("");
});

// catch invalid input
function catchInvalidInput(taskDescription) {
    try {
        if (taskDescription.length === 0 || taskDescription === ` `) {
            throw "Can't add an empty item..duhhh";
        }
        for (i=0; i < todo.tasks.length; i++) {
            if (todo.tasks[i].description === taskDescription) {
                throw "This task already exist";        
            }
        }
        if (numOfPendingTodo > 20) {
            throw "You have too many pending todos. Finish some first!"
        }
    }
    catch(err) {
        console.log(err);
        $(`.invalid-feedback`).html(err);
        $(`#taskDescription`).addClass("is-invalid");
        $(`.invalid-feedback`).css("visibility", "visible");
        return false;
    }
    return true;
}

// click to delete
$(document).on("click", ".feather-trash-2", function() {
  let val = $(this).closest(`.task-item`).find(`span`).text();
  let index = todo.tasks.findIndex(task => task.description === val);

  todo.tasks.splice(index, 1);
  updateTodoCounter();
  $(this).closest(`.task-item`).remove();
});

// Edit todo item

$(document).on("click", ".feather-edit-2", function() {
    if (editCount === 0) {  
    let currentVal = $(this).closest(`.task-item`).find(`span`).text();
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
    $(this).closest(`.task-item`).append(editWrapper);
    $(this).closest(`.task-container`).css("display","none");
    }
    editCount = 1;
});


// save changes
$(document).on("click", "#save", function() {
    event.preventDefault();
    let currentVal = $(this).closest(`.task-item`).find(`span`).text(); 
    let newVal = $("#editDescription").val();
    
    for (i=0; i < todo.tasks.length; i++) {
        if (todo.tasks[i].description === newVal) {
            $(`#editDescription`).addClass("is-invalid");
            throw "This task already exist";        
        }
    }

    if (newVal.length = 0) {
        $(this).closest(`.task-item`).find("span").text(currentVal);
    } else if (newVal != " " && newVal.length > 0) {
    let index = todo.tasks.findIndex(task => task.description === currentVal);
    todo.tasks[index].description = newVal;
    $(this).closest(`.task-item`).find("span").text(newVal);
    }
    $(this).parents().find(`.task-container`).css("display","block");
    $(this).closest(`.edit-container`).remove();
    editCount = 0;
});


// cancel changes
$(document).on("click", "#cancel", function() {
    $(this).parents().find(`.task-container`).css("display","block");
    $(this).closest(`.edit-container`).remove();
    editCount = 0;
});


// check / uncheck complete
$(document).on("change", ":checkbox", function() {
  let val = $(this).parent().find(`span`).text();
  let index = todo.tasks.findIndex(task => task.description === val);

  if (this.checked) {
    todo.tasks[index].isDone = true;
    $(this).parent().find('.feather-edit-2').css("visibility", "hidden");
    updateTodoCounter();
  } else {
    todo.tasks[index].isDone = false;
    $(this).parent().find('.feather-edit-2').css("visibility", "visible");
    updateTodoCounter();
  }
  $(this).parent().toggleClass("completed");
});

// update counter
function updateTodoCounter() {

    // Display empty state
  if (todo.tasks.length > 0) {
    $(`#todo-body`).find(`h3`).addClass(`d-none`);
  } else {
    $(`#todo-body`).find(`h3`).removeClass(`d-none`);
  }

  //Assign value to Number of pending todo & number of Completed todo

  numOfDoneTodo = todo.tasks.filter((x, i) => {return x.isDone;}).length;
  numOfPendingTodo = todo.tasks.length - numOfDoneTodo;

  if (numOfPendingTodo === 1 || numOfPendingTodo === 0) {
    $(`#numberTodo`).html(`${numOfPendingTodo} todo item`);
  } else {
  $(`#numberTodo`).html(`${numOfPendingTodo} todo items`);
  }
  $(`#clearComplete`).html(`Clear completed [${numOfDoneTodo}]`);

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

// hide complete
$("#hideComplete").click(function() {
    $(`#todo-body`).find(`.completed`).parent().toggleClass(`d-none`);

    if ($(`#todo-body`).find(`.completed`).hasClass(`d-none`)) {
      $(`#hideComplete`).text(`Show completed`);
    } else {
        $(`#hideComplete`).text(`Hide completed`);
    }
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
      $(`#todo-body`).find(`.completed`).parent().remove();
  }
  });