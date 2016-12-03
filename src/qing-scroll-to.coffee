class QingScrollTo extends QingModule

  @name: 'QingScrollTo'

  @opts:
    el: null
    container: null
    axis: 'y'
    offset: null
    duration: 500
    animation: true
    cancelIfVisible: true
    callback: $.noop

  _setOptions: (opts) ->
    super
    $.extend @opts, QingScrollTo.opts, opts

  _init: ->
    super

    @el = $(@opts.el) if @opts.el
    if not @el and @opts.offset is null
      throw new Error "QingScrollTo: el or offset option is invalid"

    @container = if @opts.container then $(@opts.container) else $('body, html')
    @opts.offset ||= 0

    @_calculateOffset()
    @_scroll() unless @_shouldBeCancel()

  _calculateOffset: ->
    if typeof @opts.offset is 'object'
      @offset = $.extend {}, @opts.offset
    else
      @offset =
        x: @opts.offset
        y: @opts.offset

    return @offset unless @el
    targetOffset = @el.offset()

    if @opts.container
      containerOffset = @container.offset()
      targetOffset.top = Math.abs(
        targetOffset.top - containerOffset.top + @container.scrollTop()
      )
      targetOffset.left = Math.abs(
        targetOffset.left - containerOffset.left + @container.scrollLeft()
      )

    @offset =
      y: targetOffset.top - @offset.y
      x: targetOffset.left - @offset.x

  _shouldBeCancel: ->
    return false unless @opts.cancelIfVisible
    if @opts.container
      viewpartHeight = @container.height()
      viewpartWidth = @container.width()
      scrollTop = @container.scrollTop()
      scrollLeft = @container.scrollLeft()
    else
      viewpartHeight = ($win = $ window).height()
      viewpartWidth = $win.width()
      scrollTop = ($doc = $ document).scrollTop()
      scrollLeft = $doc.scrollLeft()

    if (@offset.y >= scrollTop and @offset.y < scrollTop + viewpartHeight) \
        and (@offset.x >= scrollLeft and @offset.x < scrollLeft + viewpartWidth)
      true
    else
      false

  _scroll: ->
    if @opts.animation
      options =
        scrollTop: if @opts.axis isnt 'x' then @offset.y else undefined
        scrollLeft: if @opts.axis isnt 'y' then @offset.x else undefined

      hasCalled = false
      fakeCallBack = =>
        return if hasCalled
        hasCalled = true
        @opts.callback()
      @container.animate options, @opts.duration, fakeCallBack
      null

    else
      @container.scrollTop(@offset.y) if @opts.axis isnt 'x'
      @container.scrollLeft(@offset.x) if @opts.axis isnt 'y'
      @opts.callback()
      null

  destroy: ->

module.exports = QingScrollTo
