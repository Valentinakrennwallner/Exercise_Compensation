/* A class representing your resource. At the moment, its name is Resource. But you
   can (and probalby should) rename it to whatever you are going to use as a Resource.
   At the moment the example resource has only a name. You can delete this property
   if you don't need it.

   Task 1 - Part 1: Replace the Resource class with a new class of your choosing, that
   has at least three properties: one string property, one number property, one boolean
   property, and - optionally - a date property.
   Then, adapt the initialization of the data at the end of this file (Task 2 - Part 2)
   so that you have some instances of your object available that can be served to the client..
 */
class BookDiary {
    constructor(name, author, description, genre, pages, rating, finished, isBorrowed) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.genre = genre;
        this.pages = pages;
        this.rating = rating;
        this.finished = finished;
        this.isBorrowed = isBorrowed;
    }
}

/* A model managing a map of resources. The id of the object is used as key in the map. */
class Model {
    static ID = 1;

    constructor() {
        this.resources = new Map();
    }

    add(resource) {
        resource.id = Model.ID++;
        this.resources.set(resource.id, resource);
    }

    get(id) {
        this.checkId(id);
        return this.resources.get(id);
    }

    getAll() {
        return Array.from(this.resources.values());
    }

    checkId(id) {
        if (typeof id !== "number") {
            throw new Error(`Given id must be an number, but is a ${typeof id}`);
        }
    }

    create(resource) {
        this.add(resource);
        return resource;
    }

    update(id, resource) {
        this.checkId(id);

        const target = this.resources.get(id);
        if (!target) {
            throw new Error(`Resource with ${id} does not exist and cannot be updated.`)
        }

        Object.assign(target, resource);

        return target;
    }

    delete = (id) => {
        this.checkId(id);
        return this.resources.delete(id);
    }
}

const model = new Model();

/* Task 1 - Part 2. Replace these three instances of the example Class Resource with instances
   of your own class */

model.add(new BookDiary(
    "Pet Sematary",
    "Stephen King",
    " \"Pet Sematary\" is a Stephen King novel about a family that moves to an idyllic country home, only to discover that a nearby Native American burial ground has the power to resurrect the dead. As tragedies befall the family, the father decides to harness this mystical force, leading to terrible consequences and blurring the boundaries between life and death. The book delves into the dark depths of human desire and the horrifying consequences of tampering with death.",
    "Horror",
    608,
    5,
    new Date("2023-08-05").toLocaleDateString(),
    "false"
));

model.add(new BookDiary(
    "The Soul Breaker",
    "Sebastian Fitzek",
    "\"The Soul Breaker\" incapacitates victims without killing them, leaving them in a catatonic state with a cryptic note. After a pause in abductions, a mysterious man is discovered near a remote psychiatric clinic, where the weather worsens, trapping everyone inside. As the clinic's head psychiatrist also falls victim to the Soul Breaker, it becomes clear that he has returned, leaving the clinic isolated from the outside world.",
    "Thriller",
    368,
    4,
    new Date("2023-07-15").toLocaleDateString(),
    "false"
));

model.add(new BookDiary(
    "Mind Gap",
    "Anne Freytag",
    "In a world on the brink of a transformative technological revolution, the NINK chip, initially designed to erase traumatic combat memories, raises profound questions. Silvie, a journalist, becomes ensnared in a reality-altering mystery when her brother is accused of a double murder and a suicide, and she embarks on a quest for answers. Her investigation unveils the dark potential of groundbreaking advancements when misused by malevolent forces.",
    "Krimi",
    384,
    4,
    new Date("2023-09-11").toLocaleDateString(),
    "false"
));

model.add(new BookDiary(
    "The Midnight Library",
    "Matt Haig",
    "Nora's life has been going from bad to worse. Then at the stroke of midnight on her last day on earth she finds herself transported to a library. There she is given the chance to undo her regrets and try out each of the other lives she might have lived. Which raises the ultimate question: with infinite choices, what is the best way to live?",
    "Fantasy",
    320,
    4,
    new Date("2023-04-24").toLocaleDateString(),
    "false"
));

model.add(new BookDiary(
    "Reminders of Him",
    "Colleen Hoover",
    "Five years after the tragic accident that claimed her great love Scott, Kenna returns to the scene with one goal: to reunite with her four-year-old daughter, Diem, who lives with Scott's parents. On her first evening back, she meets Ledger, the first man she's felt drawn to since Scott's passing, and their attraction is mutual. However, a revelation follows that Ledger was Scott's closest friend since childhood and has vowed that the unknown mother, whom he holds responsible for Scott's death, will never have a role in Diem's life.",
    "Romance",
    320,
    3,
    new Date("2023-06-29").toLocaleDateString(),
    "true"
));

module.exports = model;
