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
  if (taskDescription.length > 0) {
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
  return numOfDoneTodo, numOfPendingTodo;
}
