var Story = React.createClass({

  collectionName: "stories",

  getInitialState: function() {
    return {
      editable: false
    };
  },

  goToStoryPage: function(id) {
    Router.go('storyPage', {_id: id});
  },

  insertStory: function(id, evt) {
    var storyModelClicked = Stories.findOne(id);

    var story = {
      title: 'Untitled',
      order: storyModelClicked.order
    };

    Meteor.call('storyInsert', story, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storyExists) {
        return alert('This Story has already been posted');
      }
    });

  },

  deleteStory: function(id) {

    Meteor.call('storyDelete', id, function(error, result) { // display the error to the user and abort
//      if (error)
//        return alert(error.reason);
    });
  },

  editableThisStory: function() {
    this.setState({
      editable: true
    });
  },

  completeEditing: function(id, evt) {

    if (!this.props.meteorUserExist) {
      return;
    }
    if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
      return; // 処理を抜ける
    }

    var story = {
      title: evt.target.textContent
    };

    Stories.update(id, {$set: story}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      }
    });

    evt.target.blur();

    this.setState({
      editable: false
    });
  },

  render: function() {

    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
      var plusButton = <button type="button" className="plus" data-dismiss="alert" onClick={this.insertStory.bind(this, this.props.story._id)}>
        <span aria-hidden="true">+</span><span className="sr-only">Plus</span>
      </button>;

      var closeButton = <button type="button" className="close" data-dismiss="alert" onClick={this.deleteStory.bind(this, this.props.story._id)}>
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>;

      var editButton =  <button type="button" className="edit pull-right" data-dismiss="alert" onClick={this.goToStoryPage.bind(this, this.props.story._id)}>
        <span aria-hidden="true">Edit</span><span className="sr-only">Edit</span>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
      var editButton = {};
    }

    var contentEditable = this.state.editable && this.props.meteorUserExist;

    return <li data-id={this.props.story._id} data-order={this.props.story.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      { plusButton }
      <span className="name" contentEditable={contentEditable}
            onClick={this.editableThisStory}
            onBlur={this.completeEditing.bind(this, this.props.story._id)}
            onKeyDown={this.completeEditing.bind(this, this.props.story._id)}
          >{this.props.story.title}</span>
      <span className="badge">{this.props.story.order}</span>
      { editButton }
      { closeButton }
    </li>
  }
});

SortableStories = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
//    ref: "stories",
    /*
    group: {
      name: 'storiesList',
      put: true
    },
    */
//    animation: 100,
    handle: ".sortable-handle"
//    model: "stories"
  },

  collectionName: "stories",

  renderStory: function(model) {
    return <Story key={model._id} story={model} meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StoryList" key="1">
      { this.props.items.map(this.renderStory) }
    </ul>;
  }
});


var StoryList = ReactMeteor.createClass({
  templateName: "storiesList",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("stories");
  },

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newStoryTitle: ''
    };
  },

  getMeteorState: function() {
    var stories = Stories.find({}, {sort: { order: 1 }}).fetch();
//    var stories = Stories.find({}, {sort: { order: 1 }});
    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      stories: stories
    };
  },



  newStoryTitleChange: function(e) {
    this.setState({
      newStoryTitle: e.target.value
    });
  },

  submitNewStory: function(e) {
    e.preventDefault();

    var story = {
      title: this.state.newStoryTitle.trim(),
      order: -1
    };

    Meteor.call('storyCreate', story, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storyExists)
        return alert('This Story has already been posted');

    });

    this.setState({
      newStoryTitle: ''
    });
  },

  render: function() {

    if (this.state.displaySubmitForm) {
      var form = <form className="main form" onSubmit={this.submitNewStory}>
        <div className="form-group">
          <label className="control-label" htmlFor="title">タイトル</label>
          <div className="controls">
            <input name="title" id="title" type="text" value={this.state.newStoryTitle} placeholder="Name your new story's title." className="form-control" onChange={this.newStoryTitleChange}/>
          </div>
        </div>
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>;
    } else {
      var form = {}
    }

    // JSXテンプレートでSortableする方法（実装途中）
    return <div className="StoryList">
          { form }
          <SortableStories items={ this.state.stories } meteorUserExist={this.state.displaySubmitForm} />
        </div>

  }

});
