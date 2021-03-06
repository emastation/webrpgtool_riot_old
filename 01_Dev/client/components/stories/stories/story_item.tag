<story-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide column">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <span class="badge one wide column">{opts.story.order}</span>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertStory}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="name ten wide column" ondblclick={editableThisStory}>
      <span if={!contentEditable}>{opts.story.title}</span>
      <input if={contentEditable} type="text" name="storyTitle" value={opts.story.title} onblur={completeEditing} onkeydown={completeEditing}>
    </div>
    <div class="four wide column">
      <a href="#game/{opts.game_id}/story/{opts.story._id}/play">
        <button type="button" class="edit circular ui icon button">
          <i class="play icon"></i>
        </button>
      </a>
      <a href="#game/{opts.game_id}/story/{opts.story._id}">
        <button if={isLogin} type="button" class="edit circular ui icon button">
          <i class="edit icon"></i>
        </button>
      </a>
      <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteStory}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>

  <script>
    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.update();
    });

    this.on('mount', ()=>{
      this.editable = false;
    });

    this.on('update', ()=>{
      this.contentEditable = this.editable && this.isLogin;
    });

    editableThisStory() {
      this.editable = true;
      this.update();
    }

    insertStory(e) {
      var storyModelClicked = MongoCollections.Stories.findOne(opts.story._id);

      var story = {
        title: '新規ストーリー',
        order: storyModelClicked.order
      };

      Meteor.call('insertStory', story, function(error, result) {
        if (error)
          return alert(error.reason);

        if (result.storyExists) {
          return alert('This Story has already been posted');
        }
      });
    }

    deleteStory() {
      Meteor.call('deleteStory', opts.story._id, (error, result)=> {
        Session.set('StoryItem_changed', Date.now());
  //      if (error)
  //        return alert(error.reason);
      });
    }

    completeEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      var story = {
        title: this.storyTitle.value
      };

      MongoCollections.Stories.update(opts.story._id, {$set: story}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });

      evt.target.blur();

      this.editable = false;
      this.update();
    }
  </script>

  <style scoped>
    input {
      width: 100%;
    }
  </style>
</story-item>
