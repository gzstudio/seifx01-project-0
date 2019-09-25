$("#signUpSubmit").on("click", function(e) {
    e.preventDefault();

    const email = $("#signUpForm").find("#signUpInputEmail").val();
    const password = $("#signUpForm").find("#signUpInputPassword").val();

    auth.createUserWithEmailAndPassword(email,password);

    $("#signUpForm").find("#signUpInputEmail").val("");
    $("#signUpForm").find("#signUpInputPassword").val("");

    $("#signUpModal").modal('toggle');
});

$("#logout").on("click", function(e) {
    e.preventDefault();
    auth.signOut().then(() =>
        console.log("user signed out")
    );
});

$("#logInSubmit").on("click", function(e) {
    e.preventDefault();

    const email = $("#logInForm").find("#logInInputEmail").val();
    const password = $("#logInForm").find("#logInInputPassword").val();

    auth.signInWithEmailAndPassword(email,password).then(cred => {
        console.log(cred.user);
    });

    $("#logInForm").find("#logInInputEmail").val("");
    $("#logInForm").find("#logInInputPassword").val("");

    $("#logInModal").modal('toggle');
});