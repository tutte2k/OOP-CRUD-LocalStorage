
// Character Class

class Character {
    constructor(name, level, vocation) {
        this.name = name
        this.level = level
        this.vocation = vocation
    }
    static greet(name) {
        let characters = DataStorage.getCharacters()
        characters.forEach((character) => {
            if (character.name != name) {
                UserInferface.showMessageAlert(`${name} greets ${character.name}`, 'success')
            }
        })
    }
    toString() {
        return `Name: ${this.name}, Level: ${this.level}, Vocation: ${this.vocation}, Promoted: ${Character.isPromoted(this.level)}`
    }
    levelUp(){
        this.level = this.level + 1
        UserInferface.showMessageAlert(`${this.name} is now level ${this.level}`, 'success')
    }
    static isPromoted(level) {
        return level >= 20
    }
    

}

// User Interface
class UserInferface {
    static displayCharacters() {
        const characters = DataStorage.getCharacters()
        characters.forEach((character) => {
            UserInferface.addCharacterToList(character)
        })
    }

    // function for adding characters to list
    static addCharacterToList(character) {
        const list = document.querySelector("#character-list")
        const tableRow = document.createElement('tr')
        tableRow.setAttribute('name', character.name)
        if (character) {
            tableRow.innerHTML = `<td>${character.name}</td><td>${character.level}</td><td>${character.vocation}</td><td><a class="btn btn-danger btn-sm del">Delete</a></td><td><a class="btn btn-warning btn-sm level">Level Up</a></td>`
            if(Character.isPromoted(character.level)){
                tableRow.innerHTML += `<td><a class="btn btn-success btn-sm greet">Greet</a></td>`
            }else{
                tableRow.innerHTML += `<td><p class="text-danger">Greetings available at level 20</p></td>`
            }
        }
        list.appendChild(tableRow)

    }

    // Function for user messages
    static showMessageAlert(message, status) {
        const div = document.createElement('div')
        div.className = `alert alert-${status}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector(".container")
        const formWrapper = document.querySelector("#character-form-wrapper")
        container.insertBefore(div, formWrapper)
        setTimeout(() => {
            document.querySelector(".alert").remove()
        }, 3000)
    }

    // Destroy character record
    static destroyCharacter(element) {
        if (element.classList.contains('del')) {
            element.parentElement.parentElement.remove()
        }
    }
    static updateCharacter(element) {
        if (element.classList.contains('level')) {
            element.parentElement.parentElement.remove()
        }
    }
    // Clear input fields after adding new character
    static clearFields() {
        document.querySelector('#name').value = ''
        document.querySelector('#level').value = ''
        document.querySelector('#vocation').value = ''
        document.querySelector('#password').value = ''
    }
}

// DataStorage class
class DataStorage {

    // Get characters from storage
    static getCharacters() {
        let characters
        if (localStorage.getItem('characters')) {
            characters = JSON.parse(localStorage.getItem('characters'))
        } else {
            characters = []
        }
        return characters
    }

    // Add character to storage
    static addCharacter(character) {
        const characters = DataStorage.getCharacters()
        characters.push(character)
        localStorage.setItem('characters', JSON.stringify(characters))

        // Clearing fields
        UserInferface.clearFields()
    }

    // Remove character from storage
    static destroyCharacter(name) {
        let characters = this.getCharacters()
        let newCharacters = []

        //Storing all but the clicked characters
        characters.forEach((character) => {
            if (character.name != name) {
                newCharacters.push(character)
            }
        })

        //Updating local storage
        localStorage.setItem('characters', JSON.stringify(newCharacters))
    }
    
}

//Display Data on page load
document.addEventListener("DOMContentLoaded", UserInferface.displayCharacters())

//Getting data from form
document.querySelector("#character-form").addEventListener("submit", (e) => {

    // Prevents page from refreshing
    e.preventDefault()

    // Get form values
    let name = document.getElementById("name").value
    let level = parseInt(document.getElementById("level").value)
    let vocation = document.getElementById("vocation").value
    let password = document.getElementById("password").value


    // Validate form values
    if (name === '' || level === '' || vocation === '' || password != 'Grit' || !Number.isInteger(level)) {
        UserInferface.showMessageAlert('Valid level, correct password and values in all fields are required', 'danger')
    } else {
        // Getting character
        const character = new Character(name, level, vocation)

        //Add character to list
        UserInferface.addCharacterToList(character)

        //Store character in local storage
        DataStorage.addCharacter(character)

        //Display success message
        UserInferface.showMessageAlert(`Added: ${character.toString()}`, 'success')
    }
})


document.querySelector("#character-list").addEventListener("click", (e) => {
    if (e.target.classList.contains('del')) {
        // Deleting character from User Interface
        UserInferface.destroyCharacter(e.target)
        target = e.target.parentElement.parentElement.getAttribute('name')
        // Deleting character from storage
        DataStorage.destroyCharacter(target)
        if (target != null) {
            UserInferface.showMessageAlert(`${target} deleted`, 'success')
        }
    }
    else if (e.target.classList.contains('greet')) {
        characters = DataStorage.getCharacters()
        target = e.target.parentElement.parentElement.getAttribute('name')
        characters.forEach((character) => {
            if (target != character.name) {
            }
            else{
                Character.greet(target)
            }
        })

    }
    else if (e.target.classList.contains('level')) {
        characters = DataStorage.getCharacters()
        let selected
        target = e.target.parentElement.parentElement.getAttribute('name')
        e.preventDefault()
        characters.forEach((character) => {
            if (target === character.name) {
                selected = character
                DataStorage.destroyCharacter(target)
                const leveledCharacter = new Character(selected.name, selected.level, selected.vocation)
                leveledCharacter.levelUp()
                //Add character to list
                UserInferface.updateCharacter(e.target)
                UserInferface.addCharacterToList(leveledCharacter)
                //Store character in local storage
                DataStorage.addCharacter(leveledCharacter)
            }
        })
    }

})

