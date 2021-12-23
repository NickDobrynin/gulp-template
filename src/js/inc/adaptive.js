/**
 * Adaptive js
 * Attribures:
 * data-adp="to(class name), when(breakpoint), position(int)"
 * Example:
 * data-adp=".class, 991.98, 1"
 */
function AdaptiveJs(type) {
    this.type = type;
}

AdaptiveJs.prototype.init = function() {
    const _this = this;
    this.objects        = [];
    this.adpClassName   = 'adp';
    this.nodes          = document.querySelectorAll('[data-adp]');

    for (let index = 0; index < this.nodes.length; index ++) {
        const   node    = this.nodes[index],
                data    = node.dataset.adp.trim(),
                dataArr = data.split(','),
                obj     = {};

        obj.element     = node;
        obj.parent      = node.parentNode;
        obj.destination = document.querySelector(dataArr[0].trim());
        obj.breakpoint  = dataArr[1] ? dataArr[1].trim() : '767.98';
        obj.place       = dataArr[2] ? dataArr[2].trim() : 'last';
        obj.index       = this.indexInParent(obj.parent, obj.element);
        this.objects.push(obj);
    }

    this.arraySort(this.objects);
    this.mediaQueries = Array.prototype.map.call(this.objects, function(item) {
        return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function(item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
    });

    for (let index = 0; index < this.mediaQueries.length; index++) {
        const   media           = this.mediaQueries[index],
                mediaSplit      = String.prototype.split.call(media, ','),
                matchMedia      = window.matchMedia(mediaSplit[0]),
                mediaBreakpoint = mediaSplit[1],
                objectsFilter   = Array.prototype.filter.call(this.objects, function(item) {
                    return item.breakpoint === mediaBreakpoint;
                });
        matchMedia.addEventListener('change', function() {
           _this.mediaHandler(matchMedia, objectsFilter);
        });
        this.mediaHandler(matchMedia, objectsFilter);
    }
}

AdaptiveJs.prototype.mediaHandler = function(matchMedia, objects) {
    if (matchMedia.matches) {
        for (let index = 0; index < objects.length; index++) {
            const object = objects[index];
            object.index = this.indexInParent(object.parent, object.element);
            this.moveTo(object.place, object.element, object.destination);
        }
    } else {
        for (let index = 0; index < objects.length; index++) {
            const object = objects[index];
            if (object.element.classList.contains(this.adpClassName)) {
                this.moveBack(object.parent, object.element, object.index);
            }
        }
    }
}

AdaptiveJs.prototype.moveTo = function(place, element, destination) {
    element.classList.add(this.adpClassName);

    if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
    }
    if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
    }

    destination.children[place].insertAdjacentElement('beforebegin', element);
}

AdaptiveJs.prototype.moveBack = function(parent, element, index) {
    element.classList.remove(this.adpClassName);

    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
        parent.insertAdjacentElement('beforeend', element);
    }
}

AdaptiveJs.prototype.indexInParent = function(parent, element) {
    const arr = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(arr, element);
}

AdaptiveJs.prototype.arraySort = function(arr) {
    if (this.type === 'min') {
        Array.prototype.sort.call(arr, function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }
                if (a.place === 'first' || b.place === 'last') {
                    return -1;
                }
                if (a.place === 'last' || b.place === 'first') {
                    return 1;
                }
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }
                if (a.place === 'first' || b.place === 'last') {
                    return 1;
                }
                if (a.place === 'last' || b.place === 'first') {
                    return -1;
                }
                return b.place - a.place;
            }
            return b.breakpoint - a.breakpoint;
        });
        return;
    }
}

const adp = new AdaptiveJs('max');
adp.init();