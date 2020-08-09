# Business/Application Logic -- "The how" -- A.K.A Programming Languages such as JS

In order to create an web application that is capable of solving a unique problem, we must make use of a programming language.

Programming languages frequently used in industry for Web Development include: Javascript, Java, PHP, Typescript, Python, Scala etc..

![bizlog](https://tpg-twxdevzone.s3.amazonaws.com/files/media/tile%20images%20for%20guides/custom-business-logic.png)

## Let's consider a function that would delete an item from our to do list. Can you figure out how the code is functioning here..?

![snippet](https://i.ibb.co/q0qXdnJ/Screen-Shot-2020-08-09-at-1-18-25-pm.png)


   <script>
      var deleteId = 0;
      function setDeleteId(event) {
        deleteId = event.dataset.itemId;
      }
      function deleteTask(id) {
        console.log(deleteId);
        fetch("/task/" + id, {
          method: "DELETE",
        })
          .then(() => window.location.reload())
          .catch((error) => console.log("Something went wrong: " + error));
      }
    </script>



> :ToCPrevNext