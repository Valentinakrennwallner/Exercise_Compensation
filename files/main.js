
/* A builder class to simplify the task of creating HTML elements */
class ElementCreator {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {
        this.element.class = clazz;
        return this;
    }

    text(content) {
        this.element.innerHTML = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value)
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener)
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    prependTo(parent) {
        parent.prepend(this.element);
        return this.element;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }

    replace(parent, sibling) {
        parent.replaceChild(this.element, sibling);
        return this.element;
    }
    image(src, alt) {
        const imgElement = document.createElement("img");
        imgElement.src = src;
        imgElement.alt = alt;
        this.element.appendChild(imgElement);
        return this;
    }
}

/* A class representing a resource. This class is used per default when receiving the
   available resources from the server (see end of this file).
   You can (and probably should) rename this class to match with whatever name you
   used for your resource on the server-side.
 */
class BookDiary {

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get idforDOM() {
        return `resource-${this.id}`;
    }
}
function add(resource, sibling) {
    const creator = new ElementCreator("article")
        .id(resource.idforDOM);

    /* Task 2: Instead of the name property of the example resource, add the properties of
       your resource to the DOM. If you do not have the name property in your resource,
       start by removing the h2 element that currently represents the name. For the 
       properties of your object you can use whatever html element you feel represents
       your data best, e.g., h2, paragraphs, spans, ... 
       Also, you don't have to use the ElementCreator if you don't want to and add the
       elements manually. */

    creator
        .append(new ElementCreator("h2").text(resource.name + ' by ' + resource.author))
    creator
        .append(new ElementCreator("h4").text('Description: ' + resource.description))
    creator
        .append(new ElementCreator("p").text('Rating: ' + resource.rating + '/5'))
    creator
        .append(new ElementCreator("p").text('Pages: ' + resource.pages))
    creator
        .append(new ElementCreator("p").text('Genre: ' + resource.genre))
    creator
        .append(new ElementCreator("p").text('Finished on: ' + resource.finished))
    creator
        .append(new ElementCreator("p").text("Borrowed: " + resource.isBorrowed))

    creator
        .append(new ElementCreator("button").text("Edit").listener('click', () => {
            edit(resource);
        }))
        .append(new ElementCreator("button").text("Remove").listener('click', () => {
            /* Task 3: Call the delete endpoint asynchronously using either an XMLHttpRequest
               or the Fetch API. Once the call returns successfully, remove the resource from
               the DOM using the call to remove(...) below. */

            fetch(`/api/resources/${resource.id}`, {method: "delete"})
                .then(response => {
                    if(response.ok) {
                        console.log("Book successfully deleted.");
                        remove(resource);  // <- This call removes the resource from the DOM. Call it after (and only if) your API call succeeds!
                    }else{
                        console.error("Error deleting the book.");
                    }
                })
                .catch(error => {
                    console.error("Failed to delete the book.", error);
                });
        }));

    const parent = document.querySelector('main');

    if (sibling) {
        creator.replace(parent, sibling);
    } else {
        creator.insertBefore(parent, document.querySelector('#bottom'));
    }
}

function edit(resource) {
    const formCreator = new ElementCreator("form")
        .id(resource.idforDOM)
        .append(new ElementCreator("h3").text("Edit " + resource.name));

    /* Task 4 - Part 1: Instead of the name property, add the properties your resource has here!
       The label and input element used here are just an example of how you can edit a
       property of a resource, in the case of our example property name this is a label and an
       input field. f, we assign the input field a unique id attribute to be able to identify
       it easily later when the user saves the edited data (see Task 4 - Part 2 below). 
    */

    formCreator
        .append(new ElementCreator("label").text("Name").with("for", "resource-name"))
        .append(new ElementCreator("input").id("resource-name").with("type", "text").with("value", resource.name));
    formCreator
        .append(new ElementCreator("label").text("Author").with("for", "resource-author"))
        .append(new ElementCreator("input").id("resource-author").with("type", "text").with("value", resource.author));
    formCreator
        .append(new ElementCreator("label").text("Description").with("for", "resource-description"))
        .append(new ElementCreator("input").id("resource-description").with("type", "text").with("value", resource.description));
    formCreator
        .append(new ElementCreator("label").text("Rating").with("for", "resource-rating"))
        .append(new ElementCreator("input").id("resource-rating").with("type","number").with("value", resource.rating));
    formCreator
        .append(new ElementCreator("label").text("Pages").with("for", "resource-pages"))
        .append(new ElementCreator("input").id("resource-pages").with("type", "number").with("value", resource.pages));
    formCreator
        .append(new ElementCreator("label").text("Genre").with("for", "resource-genre"))
        .append(new ElementCreator("input").id("resource-genre").with("type", "text").with("value", resource.genre));
    formCreator
        .append(new ElementCreator("label").text("Finished").with("for", "resource-finished"))
        .append(new ElementCreator("input").id("resource-finished").with("type", "date").with("value", resource.finished));
    const originalYear = resource.finished; //needed if no new date selected to reset value

    formCreator
        .append(new ElementCreator("label").text("Borrowed").with("for", "resource-isBorrowed"))
        .append(new ElementCreator("input").id("resource-isBorrowed").with("type", "checkbox"));
    

    /* In the end, we add the code to handle saving the resource on the server and terminating edit mode */
    formCreator
        .append(new ElementCreator("button").text("Speichern").listener('click', (event) => {
            /* Why do we have to prevent the default action? Try commenting this line. */
            event.preventDefault();     /* <--- provide a smoother user experience, without causing full page reload, allows to perform asynchronous requests */

            /* The user saves the resource.
               Task 4 - Part 2: We manually set the edited values from the input elements to the resource object. 
               Again, this code here is just an example of how the name of our example resource can be obtained
               and set in to the resource. The idea is that you handle your own properties here.
            */
            resource.name = document.getElementById("resource-name").value;
            resource.author = document.getElementById("resource-author").value
            resource.description = document.getElementById("resource-description").value
            resource.rating = document.getElementById("resource-rating").value
            resource.pages = document.getElementById("resource-pages").value
            resource.genre = document.getElementById("resource-genre").value

            newfinished = document.getElementById("resource-finished").value;

            var splitted = newfinished.split("-");

            var years = splitted[0];                            //we split the date in order to reformat it into our format
            var month = parseInt(splitted[1]);                            //System format YYYY-MM-DD
            var day = parseInt(splitted[2]);                              //Our format DD.MM.YYYY

            if (newfinished.length === 0){
                resource.finished = originalYear;                               //We have to use the length option because using null or " " does not work here
            }else{
                resource.finished = day + "." + month + "." + years;            //If the user selected no date, the release status needs to keep its original date or else its empty
            }

            const checkBoxValue = document.getElementById(resource.idforDOM).querySelector('input[type="checkbox"]').checked;

            checkBoxValue ? resource.isBorrowed = true : resource.isBorrowed = false;

            /* Task 4 - Part 3: Call the update endpoint asynchronously. Once the call returns successfully,
               use the code below to remove the form we used for editing and again render 
               the resource in the list.
            */
            fetch(`/api/resources/${resource.id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(resource)
            })
                .then(response => {
                    if(response.ok) {
                        console.log("Book successfully updated.");
                        add(resource, document.getElementById(resource.idforDOM));
                    }else{
                        console.error("Error uploading the book.");
                    }
                })
                .catch(error => {
                    console.error("Failed to update the book", error);
                });
        }))
        .replace(document.querySelector('main'), document.getElementById(resource.idforDOM));
    const parentElement = document.getElementById(resource.idforDOM);
    parentElement.querySelector('input[type="checkbox"]').checked = resource.isBorrowed;
}

function remove(resource) {
    document.getElementById(resource.idforDOM).remove();
}

/* Task 5 - Create a new resource is very similar to updating a resource. First, you add
   an empty form to the DOM with the exact same fields you used to edit a resource.
   Instead of PUTing the resource to the server, you POST it and add the resource that
   the server returns to the DOM (Remember, the resource returned by the server is the
    one that contains an id).
 */
function create() {
    const book = new BookDiary();

    const formCreator = new ElementCreator("form")
        .id(book.idforDOM)
        .append(new ElementCreator("h3").text("Add a new book"));

    const fields = [
        { label: "Name", id: "resource-name", type: "text" },
        { label: "Author", id: "resource-author", type: "text" },
        { label: "Description", id: "resource-description", type: "text" },
        { label: "Rating", id: "resource-rating", type: "number" },
        { label: "Pages", id: "resource-pages", type: "number" },
        { label: "Genre", id: "resource-genre", type: "text" },
        { label: "Finished", id: "resource-finished", type: "date" },
        { label: "Borrowed", id: "resource-isBorrowed", type: "checkbox" }
    ];

    fields.forEach(field => {
        formCreator
            .append(new ElementCreator("label").text(field.label).with("for", field.id))
            .append(new ElementCreator("input").id(field.id).with("type", field.type));
    });

    //---------- Add a save button to create the new resource ----------//
    formCreator
        .append(new ElementCreator("button").text("Save and Create").listener('click', async (event) => {
            event.preventDefault();

            //---------- Get values from the input fields ----------//

            book.name = document.getElementById("resource-name").value;
            book.author = document.getElementById("resource-author").value;
            book.description = document.getElementById("resource-description").value;
            book.rating = document.getElementById("resource-rating").value;
            book.pages = document.getElementById("resource-pages").value;
            book.genre = document.getElementById("resource-genre").value;

            let finishedDate = document.getElementById("resource-finished").value;

            if (finishedDate.length === 0){
                book.finished = null;
            }else{
                var split = finishedDate.split("-");

                var year = split[0];
                var month = parseInt(split[1]);
                var day = parseInt(split[2]);

                book.finished = day + "." + month + "." + year;
            };

            const checkBoxValue = document.getElementById("resource-isBorrowed").checked;
            book.isBorrowed = checkBoxValue;

            const requestData = {
                method: "POST",
                headers: {                                      //This is our data for the POST request, we basically encapsulate it
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(book)
            };

            try {
                const response = await fetch("/api/resources", requestData);
                if (response.ok) {
                    const createdResource = await response.json();
                    add(Object.assign(new BookDiary(), createdResource));            //Here we make the post request to create the resource, add it to the DOM and then close the forms by removing it

                    document.getElementById(book.idforDOM).remove();
                } else {
                    console.error("Error creating book.");
                }
            } catch (error) {
                console.error("Failed to create book", error);
            }
            // ---------- Reset the input fields ----------//
            fields.forEach(field => {
                document.getElementById(field.id).value = "";
                if (field.type === "checkbox") {
                    document.getElementById(field.id).checked = false;
                }
            });
        }));

    //---------- Adding the form to the DOM ----------//
    formCreator.appendTo(document.querySelector('main'));
}


document.addEventListener("DOMContentLoaded", function (event) {

    fetch("/api/resources")
        .then(response => response.json())
        .then(resources => {
            for (const book of resources) {
                add(Object.assign(new BookDiary(), book));
            }
        });
});
