document.addEventListener("DOMContentLoaded", function(){
    let select = document.getElementById('embed_mode_select');
    if ( select != null ) {
        let selected = select.options[select.selectedIndex].value;
        changeEvent(select.id, selected);
        document.addEventListener('input', function(event) {
            let idVal = getTargetIdAndValue(event);
            changeEvent(idVal[0], idVal[1]);
        });
    }
});

function getTargetIdAndValue(event) {
    let targetId = event.target.id;
    let targetValue = event.target.value;

    return [targetId, targetValue];
}

function changeEvent(id, value) {
    if (id !== 'embed_mode_select') return;
    let x, y, i;
    if ( value === 'LIGHT_BOX' ){
        x = document.querySelectorAll('.noSizedContainer, .noFullWindow, .noInLine');
        y = document.querySelectorAll('.noLightBox');
        disableDiv(x, y, i);
    } else if ( value === 'FULL_WINDOW' ) {
        x = document.querySelectorAll('.noLightBox, .noSizedContainer, .noInLine');
        y = document.querySelectorAll('.noFullWindow');
        disableDiv(x, y, i);
    } else if ( value === 'SIZED_CONTAINER' ) {
        x = document.querySelectorAll('.noLightBox, .noFullWindow, .noInLine');
        y = document.querySelectorAll('.noSizedContainer');
        disableDiv(x, y, i);
    } else if ( value === 'IN_LINE' ) {
        x = document.querySelectorAll('.noLightBox, .noSizedContainer, .noFullWindow');
        y = document.querySelectorAll('.noInLine');
        disableDiv(x, y, i);
    }
}

function disableDiv(x, y, i) {
    for (i = 0; i < x.length; i++ ) {
        x[i].classList.remove("disabled");
    }
    for (i = 0; i < y.length; i++ ) {
        y[i].classList.add("disabled");
    }
}