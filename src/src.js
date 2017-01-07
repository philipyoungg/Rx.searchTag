(($, Rx) => {
  // Events
  // ==================================

  const onInput$ = Rx.Observable.fromEvent($('input'), 'input')
  .map(e => ({
    width: e.target.scrollWidth,
    value: e.target.value,
  }));

  const onBlur$ = Rx.Observable.fromEvent($('input'), 'blur')
  .map(() => ({
    width: '4px',
    value: '',
  }));

  const onKeydown$ = Rx.Observable.fromEvent($('input'), 'keydown')
  .filter(e => e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 8 ||
    e.keyCode === 37 || e.keyCode === 39)
  .map(e => ({
    keyCode: e.keyCode,
    value: e.target.value,
    element: e.target,
  }));

  const onClick$ = Rx.Observable.fromEvent($('.input'), 'click');


// Subscription
// ==================================

  onInput$.merge(onBlur$)
  .subscribe((data) => {
    $('input')
    .css({
      width: data.width,
    })
    .val(data.value);
  },
  );

  onKeydown$
  .subscribe((data) => {
    if (data.keyCode === 8 && data.value === '') {
      $('input')
          .prev()
          .remove()
          .css({ width: '4px' });
    }
    if ((data.keyCode === 9 || data.keyCode === 13) && data.value !== '') {
      $('input')
        .before($('<span>').addClass('item').text(data.value))
        .val('')
        .css({ width: '4px' });
    }
    if (data.keyCode === 37 && data.value === '') {
      $('input')
        .insertBefore($('input').prev())
        .focus();
    }
    if (data.keyCode === 39 && data.value === '') {
      $('input')
        .insertAfter($('input').next())
        .focus();
    }
  });

  onClick$
  .subscribe(() => $('input').focus());
})($, Rx);
