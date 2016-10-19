QingScrollTo = require '../src/qing-scroll-to'
assert = chai.assert

describe 'QingScrollTo', ->

  $container = null

  beforeEach ->
    $container = $('<div class="container"></div>').appendTo 'body'

  afterEach ->
    $container.remove()

  it 'should throw Error when opts is not correct', ->
    spy = sinon.spy QingScrollTo
    try
      new spy
    catch e
    assert spy.calledWithNew()
    assert spy.threw()

  describe 'should scroll to a target', ->

    beforeEach ->
      $('<div class="blank" style="height: 2000px; width: 600px"></div>').appendTo $container
      $('<div id="target">I am here</div>').appendTo $container
      $('<div class="blank" style="height: 2000px; width: 600px"></div>').appendTo $container

    it 'without specific container', ->
      new QingScrollTo
        el: '#target'
        animation: false
      setTimeout ->
        assert.equal parseInt($('#target').offset().top), $(document).scrollTop()

    it 'with specific container', ->
      $container.css
        height: '400px'
        width: '400px'
        overflow: 'scroll'

      new QingScrollTo
        el: '#target'
        offset: 20
        container: $container
        animation: false

      setTimeout ->
        assert.equal 20, $('#target').offset().top - $container.offset().top

  describe 'should not scroll when the target is visible', ->
    beforeEach ->
      $(document).scrollTop(0)
      $('<div class="blank" style="height: 100px; width: 500px"></div>').appendTo $container
      $('<div id="target">I am here</div>').appendTo $container
      $('<div class="blank" style="height: 2000px; width: 500px"></div>').appendTo $container
      $container.css
        height: '400px'
        width: '400px'
        overflow: 'scroll'

    it 'without specific container', ->
      new QingScrollTo
        el: "#target"
        animation: false
        container: $container
        actOnVisible: false

      setTimeout ->
        assert.equal 0, $container.scrollTop()

    it 'with specific container', ->
      new QingScrollTo
        el: "#target"
        container: $container
        animation: false
        actOnVisible: false

      setTimeout ->
        assert.equal 0, $(document).scrollTop()
