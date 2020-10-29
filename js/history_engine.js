const config = {
    childList: true,
    subtree: true,
    characterDataOldValue: true
};

const callback = function(mutationsList, observer) {
    /*for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        } else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }*/
    console.log(mutationsList);
};

const observer = new MutationObserver(callback);

observer.observe(table_body[0], config);