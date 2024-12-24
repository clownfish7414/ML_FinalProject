import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, child, push, update, onChildAdded } from "firebase/database";
import initFirebase from "./config";

const init = () => {
  initFirebase();

  let user_email = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    const menu = document.getElementById("dynamic-menu");
    // Check user login
    if (user) {
      console.log("is logged in");
      user_email = user.email;
      menu.innerHTML = `<span class='dropdown-item'>${user.email}</span><span class='dropdown-item' id='logout-btn'>Logout</span>`;
      // TODO 5: Complete logout button event
      //     Steps:
      //     1. Add a listener to logout button
      //     2. Show alert when logout success or error (use "then & catch" syntax)
      const logoutbtn = document.getElementById("logout-btn");
      logoutbtn.addEventListener(
        "click",
        () => {
          signOut(auth)
            .then(() => {
              alert("User sign out success!");
            })
            .catch((error) => {
              alert("User sign out failed!");
            });
        },
        false,
      );
    } else {
      console.log("not logged in");
      // It won't show any post if not login
      menu.innerHTML = "<a class='dropdown-item' href='signin.html'>Login</a>";
      document.getElementById("post_list").innerHTML = "";
    }
  });

  const post_btn = document.getElementById("post_btn");
  const post_txt = document.getElementById("comment");

  post_btn.addEventListener("click", () => {
    if (post_txt.value != "") {
      // TODO 6: Push the post to database's "com_list" node
      //     Steps:
      //     1. Get the reference of "com_list"
      //     2. Push user email and post data to database's "com_list" node
      //     3. Clear text field

      const postData = {
        data: post_txt.value,
        email: user_email,
      };
      const db = getDatabase();
      const newPostRef = push(ref(db, "com_list"));
      set(newPostRef, postData);
      post_txt.value = "";
    }
  });

  // List for store posts html
  const total_post = [];
  // The html code for post
  const str_before_username =
    "<div class='my-3 p-3 bg-white rounded box-shadow'><h6 class='border-bottom border-gray pb-2 mb-0'>Recent updates</h6><div class='media text-muted pt-3'><img src='img/test.svg' alt='' class='mr-2 rounded' style='height:32px; width:32px;'><p class='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'><strong class='d-block text-gray-dark'>";
  const str_after_content = "</p></div></div>\n";

  const show_post = (x) => {
    total_post[total_post.length] = `${str_before_username + x.email}</strong>${x.data}${str_after_content}`;
    document.getElementById("post_list").innerHTML = total_post.join("");
  };
  // TODO 7: Show all posts on webpage including history posts and new posts.
  //     Steps:
  //     1. Get the reference of "com_list"
  //     2. Read user email and post data from database's "com_list" node
  //     3. Show the posts on webpage with show_post()
  //     Hint: Use on() with 'child_added' EventType. This event will be triggered once for each initial child at this location,
  //     and it will be triggered again every time a new child is added. So it can handle both history posts and new posts.
  //     https://firebase.google.com/docs/reference/node/firebase.database.Reference#on

  const db = getDatabase();
  onChildAdded(ref(db, "com_list"), (x) => {
    const postData = x.val();
    // console.log('onChildAdded', postData);
    show_post(postData);
  });
};

window.onload = () => {
  init();
};
