//Instance socket
var socket = io();

//Load database from server
socket.on('load', (data) => {
    $('.table tbody').html('');

    $.each(data, (key, product) => {
        addItem(key, product);
    });

    // for (var key in data) {
    //     if (data.hasOwnProperty(key)) {
    //         addItem(data[key], key);
    //     }
    // }
});

//Handling events to modal
$('.modal').on('click', (e) => {
    if (e.target.classList.contains('modal')) resetModal();
});

$('.modal-footer #cancel').on('click', () => {
    resetModal();
});

//Add items to database
$('#form').on('submit', e => {
    e.preventDefault();

    var data = {
        'title': $('#form #title').val(),
        'price': 'R$ ' + $('#form #price').val(),
        'description': $('#form #description').val()
    }

    socket.emit('product-add', data);
    socket.emit('add-item', null)
});

//Method to add procuts to client side
var addItem = (key, product) => {
    //Create new row to table  
    $('<tr>', {
        id: key
    }).appendTo('.table tbody');

    //Item of table
    /*$('<td>', {
        text: key
    }).appendTo('.table  tbody tr:last-of-type');*/

    //Item of table
    $('<td>', {
        text: product.title
    }).appendTo('.table  tbody tr:last-of-type');

    //Item of table
    $('<td>', {
        text: product.price
    }).appendTo('.table  tbody tr:last-of-type');

    //Item of table
    $('<td>', {
        text: product.description
    }).appendTo('.table  tbody tr:last-of-type');

    //Item of table
    $('<td>').appendTo('.table  tbody tr:last-of-type');

    //Edit button
    $('<a>', {
        addClass: 'form-btn',
        text: 'Editar',

        //Method to show modal 
        click: () => {
            $('<form>', {
                id: 'form-update',
                addClass: 'form',
                attr: {
                    method: 'post'
                }
            }).appendTo('.modal-body')

            $.each($('#form .form-group'), (key, component) => {
                $(component).clone().appendTo('.modal-body #form-update');
            });

            product.price = product.price.replace('R$ ', '');
            product.price = product.price.replace(',', '.');

            $('#form-update #title').val(product.title);
            $('#form-update #price').val(product.price);
            $('#form-update #description').val(product.description);

            //Remove previous button with old methods
            $('.modal-footer #submit').remove();

            //Create confirmation button
            $('<a>', {
                addClass: 'form-btn',
                text: 'Confirmar',
                attr: {
                    id: 'submit'
                },
                click: () => {
                    var data = {
                        'index': key,
                        'title': $('#form-update #title').val(),
                        'price': 'R$ ' + $('#form-update #price').val(),
                        'description': $('#form-update #description').val()
                    }

                    socket.emit('product-update', data);
                    socket.emit('add-item', null);
                    
                    resetModal();
                }
            }).appendTo('.modal-footer');

            $('.container').addClass('show-modal');
        },
        attr: {
            'data-toggle': 'modal',
            'data-target': '#modal'
        }
    }).appendTo('.table  tbody tr:last-of-type td:last-of-type');

    //Delete button  
    $('<a>', {
        addClass: 'form-btn',
        text: 'Excluir',
        click: () => {
            $('.modal-body').html('Deseja excluir o produto: ' + product.title + '?');

            $('.modal-footer #submit').remove();

            $('<a>', {
                addClass: 'form-btn',
                text: 'Confirmar',
                attr: {
                    id: 'submit'
                },
                click: () => {
                    socket.emit('product-delete', key);
                    socket.emit('add-item', null);
                    resetModal();
                }
            }).appendTo('.modal-footer');

            $('.container').addClass('show-modal');
        },
        attr: {
            'data-toggle': 'modal',
            'data-target': '#modal'
        }
    }).appendTo('.table  tbody tr:last-of-type td:last-of-type');
}

var resetModal = () => {
    $('.container').removeClass('show-modal');
    $('.modal-body').html('');
    $('.modal-footer #submit').on('click', () => {
        return true;
    });
}