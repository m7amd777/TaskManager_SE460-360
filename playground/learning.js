const person = {
    name : "mohamed",
    age: 20,
    hobbies: ['sports','music', 'reading']
}


const todos = [
    {
        id:1,
        text: 'Take out trash',
        isCompleted: true
    },
    {
        id:2,
        text: 'Meeting with boss',
        isCompleted: true
    },
    {
        id:3,
        text: 'Dentist Appt',
        isCompleted: false
    },

];

// this is A CONSTRUCTOR WOWOWOWOWOW
function Person (firstname,lastname,dob) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.dob = new Date(dob);

    // this.getBirthYear = function () {
    //     return this.dob.getFullYear();
    // }

    // this.getFullName = function() {
    //     return `${this.firstname} ${this.lastname}`;
    // }
}
//attaching to prorotype
// Person.prototype.getBirthYear = function() {
//     return this.dob.getFullYear();   
// }

// Person.prototype.getFullName = function() {
//     return `${this.firstname} ${this.lastname}`;
// }



class Person {
    constructor(firstname,lastname,dob) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.dob = new Date(dob);
    }

    getBirthYear() {
        return this.dob.getFullYear();
    }

    getFullName(){
        return `${this.firstname} ${this.lastname}`;
    }
}





const person1 = new Person('mohamed', 'badawy', '11-11-2004');
console.log(person1.getFullName());






const x = 10 ; 
if (x===10){
    console.log('hehehe');
} else if (x>10){
    console.log('x is greater than 10')
} else {
    console.log('x less than 10')
}

// //                     true : false
// const color = x>=10 ? 'red' : 'blue'
// console.log(color)






//returns an array of just the text values -- ma[
const todoText = todos.map(function(todo) {
    return todo.text
});

// console.log(todoText)


const todoCompleted = todos.filter(function(todo) {
    return todo.isCompleted === true;
});

// console.log(todoCompleted)


const todocomp = todos.filter(function(todo) {
    return todo.isCompleted === true;
}).map(function(todo) {
    return todo.text
});

// console.log(todocomp)







// for(let todo of todos) {
//     console.log(todo.text)
// }


//CONVERT TO JSON,--------------------------
// const todoJSON = JSON.stringify(todos);
// console.log(todoJSON);   very nice and all
// console.log(todos);





//--------------
// const{name1, age1}= person;

// console.log(name1);
// console.log(age1);