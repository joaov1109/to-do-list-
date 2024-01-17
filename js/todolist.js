;(function(){
    'use strict';

    //ARMAZENAR O DOM EM VARIAVEIS
    const itemImput = document.getElementById("item-input")
    const todoAddForm = document.getElementById("todo-add")
    const ul = document.getElementById("todo-list")
    const lis = ul.getElementsByTagName("li")
    
    //estrutura de dados
    let arrTasks = getSavedData()
    //criar funcção para add listener
    // function addEventLi(li){
    //     li.addEventListener("click", function(){
    //         console.log(this)

    //     })
    
    function getSavedData(){
        let tasksData = localStorage.getItem("tasks")
        tasksData = JSON.parse(tasksData)

        return tasksData && tasksData.length ? tasksData : [

         {
             name: "task 1",
             createdAt: Date.now(),
             completed: false
         }
     ]
    }

    function setNewData(){
        localStorage.setItem("tasks", JSON.stringify(arrTasks)) //passa o objeto para string
    }
    setNewData()
    //function para gerar as lis
        function generateLiTask(obj){
        const li = document.createElement("li") //passando os elemntos para o DOM
        const p = document.createElement("p")   //passando os elemntos para o DOM
        const checkButton = document.createElement("button") // crinado o button checkbox
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")


        li.className = "todo-item" // add a classe

        checkButton.className = "button-check"
        checkButton.innerHTML = `
         <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton")

        li.appendChild(checkButton)

        p.className = "task-name"    // add a classe
        p.textContent = obj.name    //indicando que o parametro passando na function vai ser o texto da task
        li.appendChild(p)   //adicionando os filhos

        editButton.className = "fas fa-edit"
        editButton.setAttribute("data-action", "editButton")
        li.appendChild(editButton)

        //caixa de texto edit
        const containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"
        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        inputEdit.value = obj.name
        containerEdit.appendChild(inputEdit)
        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "edit"
        containerEditButton.setAttribute("data-action", "containerEditButton")
        containerEdit.appendChild(containerEditButton)
        const containerCancelButton = document.createElement("button")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "cancel"
        containerCancelButton.setAttribute("data-action", "containerCancelButton")
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)




        deleteButton.classList.add("fas", "fa-trash-alt")
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(deleteButton)
        //addEventLi(li)

        return li   // retorna uma li pronta para ser adicionada na ul
    }
    //function para renderizar na tela as tasks
    function renderTasks(){
        ul.innerHTML = ""
        arrTasks.forEach(taskObj => {
        ul.appendChild(generateLiTask(taskObj))
            
        });
    }

    //criar função para add tarefas na array
    function addTask (task){
        
        arrTasks.push({ // .push adiciona um elemnto novo no final da array
            name: task,
            createdAt: Date.now(),
            completed: false,

        })
    
    setNewData()
        
    }

    function clickedUl(e){
        const dataAction = e.target.getAttribute("data-action")
        console.log(e.target)
        console.log(lis)
        if (!dataAction) return //se nao houver dataaction nao faz nada

        let currentLi = e.target
        while(currentLi.nodeName !== "LI"){ //enquanto li nodename nao for li eu reatribuo um valor
            currentLi = currentLi.parentElement
        }
        
        const currentLiIndex = [...lis].indexOf(currentLi)
        console.log(currentLiIndex)

        
        const actions = { // criar um obj para guardar as actions e dps comparar com o atributo, se houver ele executa funcao do obj
            editButton: function(){
                const editContainer = currentLi.querySelector(".editContainer"); //primeiro é necessario remover todos os atributos style
                [...ul.querySelectorAll(".editContainer")].forEach( container => {
                    container.removeAttribute("style")
                });
                // depois e necessario atribuir a linha atual o style display flex
                editContainer.style.display = "flex";
                
            },
            deleteButton: function(){
                arrTasks.splice(currentLiIndex, 1)
                console.log(arrTasks)
                renderTasks()
                setNewData()
                // currentLi.remove()
            },
            containerEditButton: function(){
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },
            containerCancelButton: function(){
                currentLi.querySelector(".editContainer").removeAttribute("style")
                currentLi.querySelector(" .editInput").value = arrTasks[currentLiIndex].name

            },
            checkButton: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed //receber o oposto
                if ( arrTasks[currentLiIndex].completed){
                    currentLi.querySelector(".fa-check").classList.remove("displayNone")
                } else{
                    currentLi.querySelector(".fa-check").classList.add("displayNone")
                }
                setNewData()
                renderTasks()
            }
            
        }
        
        if (actions[dataAction]){
            actions[dataAction]()
        }
        
    }

    // adicionando o evento apos clicar no botao de add task

    todoAddForm.addEventListener("submit", function(e){
        e.preventDefault()
        console.log(itemImput.value)
        addTask(itemImput.value) // chamando a função que adiciona task
        renderTasks()
        itemImput.value = "" //limpando o valor do input
        itemImput.focus()
        //F132
    });

    ul.addEventListener("click", clickedUl)
    renderTasks()
        
    


})()