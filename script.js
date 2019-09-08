


const form = $('form');

const todo = {
    tasks: [],
    addTask : function(input) {
      let task = {
        description: input,
        isDone : false,
        markDone : function() {
        }
      }
      this.tasks.push(task);
    }
  }
  


  $(`#addTask`).click(function(event) {
    event.preventDefault();
    let taskDescription = $('#taskDescription').val();
    todo.addTask($('#taskDescription').val());
    let taskWrapper = (`
    <div id="taskWrapper-${todo.tasks.length}" class="custom-control custom-checkbox task-item">
        <input type="checkbox" class="custom-control-input" id="task-${todo.tasks.length}">
        <label class="custom-control-label" for="task-${todo.tasks.length}">${taskDescription}</label>
        <div class="task-action"><i data-feather="edit-2"></i>
        <i data-feather="trash-2"></i></div>
    </div>`);
    $(`#todo-body`).append(taskWrapper);
    $(`#numberTodo`).html(`${todo.tasks.length} todo items`);
    feather.replace()
  });

  $(`#todo-body`).on('click', '.feather-trash-2', function() {
    let removeTask = $(this).closest(`.custom-control-label`).val();
    todo.tasks = jQuery.grep(todo.tasks, function(value) {
        return value != removeTask;
    });
    $(this).closest(`.task-item`).remove();
      
  });

  
  $('.task-item :checkbox').change(function() {
      if (this.checked) {
        tasks.isDone = true;
      } else {
        tasks.isDone = false;
      }
  });
  
  