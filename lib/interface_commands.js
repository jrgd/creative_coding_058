$(document).ready(function(){

  document.addEventListener('keydown', (e) => {
    if (e.metaKey && String.fromCharCode(e.keyCode).toLowerCase() === 's') {
      e.preventDefault();
      e.stopPropagation();
      save_the_file();
    }
  }, false);

  setup_interface();

  function setup_interface() {
    console.log('setup');
    $(".file_list a").on('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      save_the_file();

      // open the file = load the file
      console.log('open the file');
      data = {file_path: $(this).attr('href')};
      $.get(
        './lib/open_file.php',
        data,
        function(response){
          
          $('#meta_content').find('.file_header_id').remove();

          // check for headers when opening an existing file
          // if (! response.includes(':+id')) {
          // the file include the operator
          // BUT
          // the operator to be valid must be placed at the beginning of a line
          // so: so far, we have a false-positive
          // we will have to split the string into an array on single lines
          // and check for each single line to startsWith

          // SETTIGN UP THE :+ID OPERATOR AT THE TOP OF A DOCUMENT WHERE IT IS MISSING
          var id_found = false;
          var file_lines_array = response.split("\n");
          // console.log(file_lines_array);

          for(e of file_lines_array) {
            // console.log(e);

            // get rid of html tags using the browser parser
            var e_parsed = $.parseHTML(e);
            var e_htmless = $('<div></div>')
              .html(e_parsed)
              .text();
            // console.log(e_htmless);
            if(e_htmless.startsWith(':+id ')) {
              // console.log(':+id operator found.');
              id_found = true
              break; // bailing out early
            } else {
              // iterate to the new line
            }
          }

          // base64 encode filename + '--' + date
          console.log('id_found: '+id_found);

          if (id_found == false) {
            var file_header_id = btoa(data.file_path + '--' + Date.now());
            console.log(file_header_id);
            $('<input>')
              .attr('value', file_header_id)
              .addClass('file_header_id')
              .appendTo( $('#meta_content') );

            response = ':+id ' + file_header_id + '\n' + response;
          } else {
            // id_found is true
          }

          // }
          if (! response.includes(':+creation-date')) {

          }

          
          // INSERT THE RESPONSE IN THE PAGE
          $(document).prop('title', 'Writing '+data.file_path);
          $("#text_editor #textarea").html(response);
          $("#text_editor #textarea").attr({'data-file_path': data.file_path});
          $("#latest_message").html("Opened "+ data.file_path);
          console.log("Opened "+ data.file_path);

        }
      )
    });
  }

  $('a[role=save_file]').on('click', function(e){
    e.preventDefault();
    save_the_file();
  })

  $('a[role=create_file]').on('click', function(e){
    e.preventDefault();
    // create new file
    var new_file_name = $('#new_file_name').val();
    var new_file_path = './documents/'+new_file_name;
    var data = {file_path: new_file_path};
    $.get(
      './lib/new_file.php',
      data,
      function(response){
        console.log(response);
        $("#latest_message").html(response);
        $("#text_editor #textarea").attr({'data-file_path': data.file_path});
      }
    )
    // update the list of files

  });

  function save_the_file() {
    console.log('save the file');
    var file_path = $('#textarea').attr('data-file_path');
    console.log(file_path)
    if (file_path === 'new') {
      // asks for filename, or automatically increment the file name
      // then save the content
      data = {file_path: './documents/'+file_path, content:$('#textarea').html() };
      actually_saves_the_file(data);
    } else {
      data = {file_path: file_path, content:$('#textarea').html() };
      actually_saves_the_file(data);  
    }
  }
  function actually_saves_the_file(data) {
    $.get(
      './lib/save_file.php',
      data,
      function(response){
        console.log(response);
        $("#latest_message").html(response);
        // $("#text_editor #textarea").attr({'data-file_path': data.file_path});
      }
    )
  }

  // it's very c-rude to poll so often, but that will do to kickstart the working integration
  // setInterval(refresh_tags_list, 2000);
  refresh_tags_list();
  function refresh_tags_list() {
    $.get('./lib/parse_files_tags.php',
      function(response){
        $('#tags_content').html(response);
        // setup_interface();
      }
    );
  }

  
  $("[contenteditable]").focusout(function(){});
  $('#textarea').on('keyup', function(){});

});