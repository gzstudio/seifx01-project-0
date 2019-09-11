let numOfPendingTodo = 0;
let numOfDoneTodo = 0;


const todo = {
  tasks: [],
  completedTasks: [],
  addTask: function(input) {
    let task = {
      description: input,
      isDone: false,
      markDone: function() {},
      editDescription: function() {}
    };
    this.tasks.push(task);
  }
};

$(`#addTask`).click(function(event) {
  event.preventDefault();
  let taskDescription = $("#taskDescription").val();

  $(`.invalid-feedback`).css("visibility", "hidden");
  $(`#taskDescription`).removeClass("is-invalid");
  let isError = catchInvalidInput(taskDescription);
  if (taskDescription.length > 0 && isError === true) {
    todo.addTask($("#taskDescription").val());
    let taskWrapper = `
        <div id="taskWrapper-${todo.tasks.length}" class="custom-control custom-checkbox task-item">
            <input type="checkbox" class="custom-control-input" id="task-${todo.tasks.length}">
            <label class="custom-control-label" for="task-${todo.tasks.length}"><span>${taskDescription}</span></label>
            <div class="task-action"><i data-feather="edit-2"></i>
            <i data-feather="trash-2"></i></div>
        </div>`;
    $(`#todo-body`).append(taskWrapper);
    upDateTodoCounter();
    feather.replace();
  }
  $("#taskDescription").val("");
});

function catchInvalidInput(taskDescription) {
    try {
        if (taskDescription.length === 0) {
            throw `Can't add an empty item..duhhh`;
        }
        for (i=0; i < todo.tasks.length; i++) {
            if (todo.tasks[i].description === taskDescription) {
                throw `This task already exist`;        
            }
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


$("#hideComplete").click(function() {
  $(`#todo-body`)
    .find(`.completed`)
    .toggleClass(`d-none`);
  if (
    $(`#todo-body`)
      .find(`.completed`)
      .hasClass(`d-none`)
  ) {
    $(`#hideComplete`).text(`Show completed items`);
  } else {
    $(`#hideComplete`).text(`Hide completed items`);
  }
});

$("#clearComplete").click(function() {
    let i = 0;
    while(i < todo.tasks.length) {
        if(todo.tasks[i].isDone === true) {
            todo.tasks.splice(i, 1);
        }
        i++;
    }
    upDateTodoCounter();
    $(`#todo-body`)
        .find(`.completed`)
        .remove();
});

$(document).on("click", ".feather-trash-2", function() {
  let val = $(this)
    .closest(`.task-item`)
    .find(`span`)
    .text();
  let index = todo.tasks.findIndex(task => task.description === val);
  todo.tasks.splice(index, 1);
  upDateTodoCounter();
  $(this)
    .closest(`.task-item`)
    .remove();
});

$(document).on("click", ".feather-edit-2", function() {
    let currentVal = $(this)
    .closest(`.task-item`)
    .find(`span`)
    .text();
    console.log(currentVal);
});


$(document).on("change", ":checkbox", function() {
  let val = $(this)
    .parent()
    .find(`span`)
    .text();
  let index = todo.tasks.findIndex(task => task.description === val);
  if (this.checked) {
    todo.tasks[index].isDone = true;
    upDateTodoCounter();
  } else {
    todo.tasks[index].isDone = false;
    upDateTodoCounter();
    console.log("Bai");
  }
  $(this)
    .parent()
    .toggleClass("completed");
});

function upDateTodoCounter() {
  if (todo.tasks.length > 0) {
    $(`#todo-body`)
      .find(`h3`)
      .addClass(`d-none`);
  } else {
    $(`#todo-body`)
      .find(`h3`)
      .removeClass(`d-none`);
  }
  numOfDoneTodo = todo.tasks.filter((x, i) => {
    return x.isDone;
  }).length;
  numOfPendingTodo = todo.tasks.length - numOfDoneTodo;
  $(`#numberTodo`).html(`${numOfPendingTodo} todo items`);
  $(`#clearComplete`).html(`Clear complete [${numOfDoneTodo}]`);
  return numOfDoneTodo, numOfPendingTodo;
}
