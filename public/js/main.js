$('document').ready(function(){
$('.deleteUser').on('click', deleteUser);
});


function deleteUser(){
    var id = $(this).data('id');
    var confirmPrompt = confirm('Are you sure ?');
    if(confirmPrompt){
        $.ajax({
            type: 'DELETE',
            url: '/geo/delete/'+id

        }).done(function(response){
            window.location.replace('/');

        });
         window.location.replace('/');

    }else{
        return false;
    }
}


