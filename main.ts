interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean
}
class TaskManager {
    private tasks: Task[] = [];
    private apiUrl: string = 'http://localhost:3000/tasks';
    async addTask(task: Task) {
        try {
            task.id = generateUniqueNumber().toString();
            task.completed = false; 
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            const newTask = await response.json();
            this.tasks.push(newTask);

                return newTask;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }

    async getTasks() {
        try {
            const response = await fetch(this.apiUrl);
            this.tasks = await response.json();
            return this.tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    async updateTask(id: string, updatedTask: Task) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            const updatedTaskData = await response.json();
            const index = this.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTaskData;
            }
            return updatedTaskData;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async toggleTask(id: string, completed: boolean) {
        try{
            const task = this.tasks.find(task => task.id === id);
            if (!task) {
                throw new Error(`Task with id ${id} not found`);
            }
            task.completed = completed;

            // Update the task on the server
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...task }),
            });
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    }

    async deleteTask(id: string) {
        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
            });
            this.tasks = this.tasks.filter(task => task.id !== id);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    getTask(id: string) {
        return this.tasks.find(task => task.id === id);
}
}

const taskManager = new TaskManager();
const form = document.querySelector('form');
const taskList = document.getElementById('tasks');

form?.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const taskId = formData.get('id') as string;
    
    if (taskId) {
        // Update existing task
        const task: Task = {
            id: taskId,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            completed: false
        };
        await taskManager.updateTask(taskId, task);
} else {
        // Add new task
        const task: Task = {
            id: "0",
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            completed: false,
        };
        await taskManager.addTask(task);
    }
        const tasks = await taskManager.getTasks();
    renderTasks(tasks);
// Reset form
    (e.target as HTMLFormElement).reset();
    const submitInput = form?.querySelector('input[type="submit"]') as HTMLInputElement;
    submitInput.value = 'Add Task';
    submitInput.classList.remove('editButton');
});

function createTaskElement(task: Task): HTMLLIElement {
    const li = document.createElement('li');
    li.dataset.id = task.id.toString();
    if (task.completed) {
        li.classList.add('done');
    }

    li.innerHTML = `
        <h3>${task.title}</h3>
        <div class="buttons">
            <button class="done" title="Mark task as complete">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path d="M56 2L18.8 42.9 8 34.7H2L18.8 62 62 2z" />
                </svg>
            </button>
            <button class="edit" title="Edit task">
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#292d32">
                        <path d="m15 22.75h-6c-5.43 0-7.75-2.32-7.75-7.75v-6c0-5.43 2.32-7.75 7.75-7.75h2c.41 0 .75.34.75.75s-.34.75-.75.75h-2c-4.61 0-6.25 1.64-6.25 6.25v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 5.43-2.32 7.75-7.75 7.75z" />
                        <path d="m8.49935 17.6901c-.61 0-1.17-.22-1.58-.62-.49-.49-.7-1.2-.59-1.95l.43-3.01c.08-.58.46-1.33.87-1.74l7.87995-7.88004c1.99-1.990001 4.01-1.990001 6 0 1.09 1.09 1.58 2.2 1.48 3.31-.09.9-.57 1.78-1.48 2.68l-7.88 7.88004c-.41.41-1.16.79-1.74.87l-3.00995.43c-.13.03-.26.03-.38.03zm8.06995-14.14004-7.87995 7.88004c-.19.19-.41.63-.45.89l-.43 3.01c-.04.29.02.53.17.68s.39.21.68.17l3.00995-.43c.26-.04.71-.26.89-.45l7.88-7.88004c.65-.65.99-1.23 1.04-1.77.06-.65-.28-1.34-1.04-2.11-1.6-1.6-2.7-1.15-3.87.01z" />
                        <path d="m19.8496 9.82978c-.07 0-.14-.01-.2-.03-2.63-.74-4.72-2.83-5.46-5.46-.11-.4.12-.81.52-.93.4-.11.81.12.92.52.6 2.13 2.29 3.82 4.42 4.42.4.11.63.53.52.93-.09.34-.39.55-.72.55z" />
                    </g>
                </svg>
            </button>
            <button class="delete" title="Delete task">
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="m3 6h18m-16 0v14c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2v-14m-11 0v-2c0-1.10457.89543-2 2-2h4c1.1046 0 2 .89543 2 2v2" />
                        <path d="m14 11v6" />
                        <path d="m10 11v6" />
                    </g>
                </svg>
            </button>
        </div>
    `;

    // Add event listeners to buttons
    const doneButton = li.querySelector('.done');
    const editButton = li.querySelector('.edit');
    const deleteButton = li.querySelector('.delete');

    doneButton?.addEventListener('click', async () => {
        await taskManager.toggleTask(task.id, true);
        const tasks = await taskManager.getTasks();
        renderTasks(tasks);
    });

    editButton?.addEventListener('click', () => {
        const titleInput = form?.querySelector('input[name="title"]') as HTMLInputElement;
        const descInput = form?.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const idInput = form?.querySelector('input[name="id"]') as HTMLInputElement;
        const submitInput = form?.querySelector('input[type="submit"]') as HTMLInputElement;

        titleInput.value = task.title;
        descInput.value = task.description;
        idInput.value = task.id.toString();
        submitInput.value = 'Update Task';
        submitInput.classList.add('editButton');
    });

    deleteButton?.addEventListener('click', async () => {
        await taskManager.deleteTask(task.id);
        const tasks = await taskManager.getTasks();
        renderTasks(tasks);
    });

    return li;
}

function renderTasks(tasks: Task[]) {
    if (taskList) {
        tasks.forEach(task => {
            // to optimize performance, we need to check if the task already exists in the list
            const existingTaskElement = taskList.querySelector(`li[data-id="${task.id}"]`);
            if (existingTaskElement) {
                // If the task already exists, we can update its content instead of creating a new element
                existingTaskElement.querySelector('h3')!.textContent = task.title;
                existingTaskElement.classList.toggle('done', task.completed);
                return;
            }
            taskList.appendChild(createTaskElement(task));
        });
    }
}
 
document.addEventListener('DOMContentLoaded', async () => {
    const tasks = await taskManager.getTasks();
    renderTasks(tasks);
});
function generateUniqueNumber(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
/*<li class="done">
<!-- todo: done -->
<h3>Task Title</h3>
<div class="buttons">
    <button class="done" title="Mark task as complete"><svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64">
            <path d="M56 2L18.8 42.9 8 34.7H2L18.8 62 62 2z" />
        </svg>
    </button>
    <button class="edit" title="Edit task"><svg fill="none" height="24" viewBox="0 0 24 24"
            width="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="#292d32">
                <path
                    d="m15 22.75h-6c-5.43 0-7.75-2.32-7.75-7.75v-6c0-5.43 2.32-7.75 7.75-7.75h2c.41 0 .75.34.75.75s-.34.75-.75.75h-2c-4.61 0-6.25 1.64-6.25 6.25v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 5.43-2.32 7.75-7.75 7.75z" />
                <path
                    d="m8.49935 17.6901c-.61 0-1.17-.22-1.58-.62-.49-.49-.7-1.2-.59-1.95l.43-3.01c.08-.58.46-1.33.87-1.74l7.87995-7.88004c1.99-1.990001 4.01-1.990001 6 0 1.09 1.09 1.58 2.2 1.48 3.31-.09.9-.57 1.78-1.48 2.68l-7.88 7.88004c-.41.41-1.16.79-1.74.87l-3.00995.43c-.13.03-.26.03-.38.03zm8.06995-14.14004-7.87995 7.88004c-.19.19-.41.63-.45.89l-.43 3.01c-.04.29.02.53.17.68s.39.21.68.17l3.00995-.43c.26-.04.71-.26.89-.45l7.88-7.88004c.65-.65.99-1.23 1.04-1.77.06-.65-.28-1.34-1.04-2.11-1.6-1.6-2.7-1.15-3.87.01z" />
                <path
                    d="m19.8496 9.82978c-.07 0-.14-.01-.2-.03-2.63-.74-4.72-2.83-5.46-5.46-.11-.4.12-.81.52-.93.4-.11.81.12.92.52.6 2.13 2.29 3.82 4.42 4.42.4.11.63.53.52.93-.09.34-.39.55-.72.55z" />
            </g>
        </svg></button>
    <button class="delete" title="Delete task"><svg fill="none" height="24" viewBox="0 0 24 24"
            width="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path
                    d="m3 6h18m-16 0v14c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2v-14m-11 0v-2c0-1.10457.89543-2 2-2h4c1.1046 0 2 .89543 2 2v2" />
                <path d="m14 11v6" />
                <path d="m10 11v6" />
            </g>
        </svg></button>
</div>
</li>*/
// taskList?.addEventListener('click', async (e) => {
//     const target = e.target as HTMLElement;
//     console.log('target', target);
    
//     if(target.tagName === 'BUTTON'){
//         if(target.classList.contains('done')){
//             const taskId = target.closest('li')?.dataset.id;
//             if(taskId){
//                 await taskManager.toggleTask(parseInt(taskId), true);

//                    const tasks = await taskManager.getTasks();
//                 renderTasks(tasks);
//         }
//         }
//         if(target.classList.contains('edit')){
//             const taskId = target.closest('li')?.dataset.id;
//             if(taskId){
//                 const titleInput = form?.querySelector('input[name="title"]') as HTMLInputElement;
//                 const descInput = form?.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
//                 const idInput = form?.querySelector('input[name="id"]') as HTMLInputElement;
//                 const submitInput = form?.querySelector('input[type="submit"]') as HTMLInputElement;

//                 const task = taskManager.getTask(parseInt(taskId));
//                 if (task) {
//                     titleInput.value = task.title;
//                     descInput.value = task.description;
//                     idInput.value = taskId;
//                     submitInput.value = 'Update Task';
//                         submitInput.classList.add('editButton');
//             }
//             }
//         }
//         if(target.classList.contains('delete')){  
//             const taskId = target.closest('li')?.dataset.id;
//             if(taskId){
//                 await taskManager.deleteTask(parseInt(taskId));
//                     const tasks = await taskManager.getTasks();
//                 renderTasks(tasks);
//         }
//         }
//     }
// });
//this have problems with the event delegation that it return the icon not button
// , so I will use a different approach