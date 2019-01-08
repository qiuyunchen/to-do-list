class Storage {
    constructor(key) {
        this.key = key;
    }
    save(data){
        window.localStorage.setItem(this.key, JSON.stringify(data));
    }
    getStorage(){
        const data = window.localStorage.getItem(this.key);
        if(data){
            return JSON.parse(data);
        }
        return data;
    }
}

class Item {
    constructor(itemName,isComplete = false){
        this.itemName = itemName;
        this.isComplete = isComplete;
    }
}

//-------------------------------GLOBAL VARIABLES
const storage = new Storage('appState');

const searchBar = document.querySelector('input');
const listsContainer = document.querySelector('.container-2-col');
const toDoContainer = document.querySelector('.to-do-list');
const doneContainer = document.querySelector('.completed-list');

//-------------------------------HELPER FUNCTIONS
const interpolateDone = (task, i) => {
    return `
    <li js-index='${i}' class="list-group-item d-flex justify-content-between align-items-center light-green">
        &#10024; &#10004; ${task}    
        <span class="badge badge-primary badge-pill">X</span>
    </li>
    `
}

const interpolateToDo = (task, i) => {
    return `
    <li js-index='${i}' class="list-group-item d-flex justify-content-between align-items-center">
        ${task}
        <span class="badge badge-primary badge-pill">X</span>
    </li>
    `
}

//-------------------------------STATE & RENDER
let state = {
    todos: [],
};

const render = state => {
    let toDoHTML = '';
    let doneHTML = '';
    state.todos.forEach( (item, i) =>{
        if (item.isComplete === false){
            toDoHTML += interpolateToDo(item.itemName, i);
        } else {
            doneHTML += interpolateDone(item.itemName, i);
        }
    });
    toDoContainer.innerHTML = toDoHTML;
    doneContainer.innerHTML = doneHTML;
}

const saveAndRender = () =>{
    storage.save(state);
    render(state);
}

// Initial state
const addNewItems = arrOfStr =>{
    arrOfStr.forEach(str => state.todos.push(new Item(str)));
}
addNewItems([
    "don't leave paint in center of room; too much sun exposure",
    'rip off excess tape and remove dirty uneven stuff from wooden planks, tape up areas if necessary',
    'paint 1 side of wooden planks white and wait a day to dry',
    'flip paint-dried wooden planks over to paint the other side',
    'paint next-to-door closet inner-trim/top-wall and ceiling white',
    'paint living-rm closet top-wall/inner-trim and ceiling white',
    'paint kitchen ceiling and walls white',
    'paint next-to-fridge wall green',
    'bdrm closet - take down shelf-making metals and upper-most shelf',
    'plaster up bathrm and bdrm holes',
    'cut out Styrofoam patch for closet door hole',
    'touch up outlets with paint',
    'put back cover when outlet touch-ups are dry',
]);

//-------------------------------EVENT: HIT ENTER TO ADD TO-DO ITEM
searchBar.addEventListener('keydown', e =>{
    if(e.key === 'Enter') {
        const itemName = e.target.value.trim();
        if(itemName) {
            const item = new Item(itemName);
            state.todos.unshift(item);
            saveAndRender();
        }
        e.target.value = '';
    }
});

//-------------------------------CLICK EVENTS
listsContainer.addEventListener('click', e =>{

    //---------------------------CLICK X TO REMOVE ITEM
    if (e.target.innerText === 'X'){
        const index = e.target.parentNode.getAttribute('js-index');
        state.todos.splice(index, 1);
        saveAndRender();
    }

    //-------------CLICK ON TO-DO ITEM / COMPLETED ITEM TO MOVE TO OTHER LIST
    if (e.target.tagName === 'LI'){
        const index = e.target.getAttribute('js-index');
        state.todos[index].isComplete = !state.todos[index].isComplete;
        saveAndRender();
        
        const toDoArr = state.todos.filter(item => item.isComplete === false);
        if (toDoArr.length === 0){
            const congrats = `
            <div class='to-do-default'>
                <p>&#127881; Congrats! &#127881;</p>
                <p>Your to-do board is clear!</p>
                <p>&#127880;&#127880;</p>
                <p>&#128079;&#128079;&#128079;</p>
            </div>
            `;
            toDoContainer.innerHTML = congrats;
        }
    }
    
});

//-------------------------------RETRIEVE STORED STATE
const storedState = storage.getStorage();
if (storedState) {
    state = storedState;
}
render(state);
