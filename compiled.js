'use strict';

(function ($, Rx) {
  // Events
  // ==================================

  var onInput$ = Rx.Observable.fromEvent($('input'), 'input').map(function (e) {
    return {
      width: e.target.scrollWidth,
      value: e.target.value
    };
  });

  var onBlur$ = Rx.Observable.fromEvent($('input'), 'blur').map(function () {
    return {
      width: '4px',
      value: ''
    };
  });

  var onKeydown$ = Rx.Observable.fromEvent($('input'), 'keydown').filter(function (e) {
    return e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39;
  }).map(function (e) {
    return {
      keyCode: e.keyCode,
      value: e.target.value,
      element: e.target
    };
  });

  var onClick$ = Rx.Observable.fromEvent($('.input'), 'click');

  // Subscription
  // ==================================

  onInput$.merge(onBlur$).subscribe(function (data) {
    $('input').css({
      width: data.width
    }).val(data.value);
  });

  onKeydown$.subscribe(function (data) {
    if (data.keyCode === 8 && data.value === '') {
      $('input').prev().remove().css({ width: '4px' });
    }
    if ((data.keyCode === 9 || data.keyCode === 13) && data.value !== '') {
      $('input').before($('<span>').addClass('item').text(data.value)).val('').css({ width: '4px' });
    }
    if (data.keyCode === 37 && data.value === '') {
      $('input').insertBefore($('input').prev()).focus();
    }
    if (data.keyCode === 39 && data.value === '') {
      $('input').insertAfter($('input').next()).focus();
    }
  });

  onClick$.subscribe(function () {
    return $('input').focus();
  });
})($, Rx);
