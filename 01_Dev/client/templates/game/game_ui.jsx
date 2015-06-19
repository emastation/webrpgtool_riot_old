var GameUi = ReactMeteor.createClass({
  templateName: "gameUi",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("uiScreens");
    Meteor.subscribe("uiTables");
  },

  getInitialState: function() {
    return {
    };
  },

  getMeteorState: function() {
    var uiTables = [];
    var uiScreen = MongoCollections.UiScreens.findOne();
    if (!_.isUndefined(uiScreen)) {
      for (var i=0; i<uiScreen.uiTables.length; i++) {
        uiTables.push(MongoCollections.UiTables.findOne({identifier: uiScreen.uiTables[i]}));
      }
    }
    var uiOperation = MongoCollections.UiOperations.findOne();

    return {
      uiScreen: uiScreen,
      uiTables: uiTables,
      uiOperation: uiOperation
    };
  },

  render: function() {

    if (_.isUndefined(this.state.uiScreen)) {
      var uiScreen = {};
    } else {
      var uiScreen = <UiScreen uiScreen={this.state.uiScreen} uiTables={this.state.uiTables} uiOperation={this.state.uiOperation} />;
    }

    return <div id="game-ui-body">
      { uiScreen }
    </div>

  }

});
