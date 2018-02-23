function getForm() {
  if (window.navigator.appName.toLowerCase().indexOf("microsoft") > -1)
    return document.event;
  else
    return document.forms["event"];
} // getForm

function submit() {
  getForm().submit();
  return false;
}

function setAndSubmit(id, value) {
  document.getElementById(id).value = value;
  submit();
  return false;
}

function onClickMainCategories(catval) {
  var mainCategs = document.getElementsByName("mc");
  for ( var i = 0; i < mainCategs.length; i++) {
    if (mainCategs[i].value == catval) {
      if (mainCategs[i].checked) {
        var mainCategory = mainCategs[i].value;
        var categs = document.getElementsByName("sc");
        for ( var x = 0; x < categs.length; x++) {
          if (categs[x].value.indexOf(mainCategory) != -1) {
            categs[x].checked = true;
          }
        }
      } // if
      else {
        var categs = document.getElementsByName("sc");

        for ( var x = 0; x < categs.length; x++) {
          if (categs[x].value.indexOf(catval) != -1) {
            categs[x].checked = false;
          }
        }
        // var mainCategory = mainCategs[i].value;
        // var categs = document.getElementsByName("sc");
        // for (var x = 0; x < categs.length; x++) {
        // if (categs[x].value.indexOf(mainCategory) != -1) {
        // categs[x].checked = false; }
        // }
      } // else

    }
  }
} // onClickMainCategories

function onClickSubCategories() {
  var subCategs = document.getElementsByName("sc");
  for ( var i = 0; i < subCategs.length; i++) {
    if (subCategs[i].checked == false) {
      var position = subCategs[i].value.indexOf(":");
      var mainCateg = subCategs[i].value.substring(0, position);
      var mainCategs = document.getElementsByName("mc");
      for ( var x = 0; x < mainCategs.length; x++) {
        if (mainCategs[x].value == mainCateg) {
          mainCategs[x].checked = false;
        }
      }
    }
  }
} // onChangeSubCategories

