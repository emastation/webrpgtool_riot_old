<object-schema-item-attribute>
  <div class="ui grid segment">
    <div class="one wide column">
      <button if={opts.is_login} type="button" class="plus circular ui icon button" onclick={insertAttribute.bind(this, opts.i)}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="fourteen wide column">
      <div class="ui grid">
        <div class="five wide column" ondblclick={editableThisAttributeIdentifier.bind(this, opts.i)}>
          <label>識別子</label>
          <span if={_.isUndefined(this.contentEditableAttributeIdentifiers[opts.i]) || this.contentEditableAttributeIdentifiers[opts.i] === false}>{opts.attribute.identifier}</span>
          <input if={(!_.isUndefined(this.contentEditableAttributeIdentifiers[opts.i])) && this.contentEditableAttributeIdentifiers[opts.i] === true} type="text" value={opts.attribute.identifier} onblur={completeAttributeIdentifierEditing.bind(this, opts.i)} onkeydown={completeAttributeIdentifierEditing.bind(this, opts.i)}>
        </div>
        <div class="five wide column" ondblclick={editableThisAttributeName.bind(this, opts.i)}>
          <label>名前</label>
          <span if={_.isUndefined(this.contentEditableAttributeNames[opts.i]) || this.contentEditableAttributeNames[opts.i] === false}>{opts.attribute.name}</span>
          <input if={(!_.isUndefined(this.contentEditableAttributeNames[opts.i])) && this.contentEditableAttributeNames[opts.i] === true} type="text" value={opts.attribute.name} onblur={completeAttributeNameEditing.bind(this, opts.i)} onkeydown={completeAttributeNameEditing.bind(this, opts.i)}>
        </div>
        <div class="five wide column" ondblclick={editableThisAttributeName.bind(this, opts.i)}>
          <label>タイプ</label>
          <select if={opts.is_login} value={opts.attribute.type} onchange={onChangeSelectAttributeType.bind(this, opts.i)}>
            <option value="number">数値</option>
            <option value="string">文字列</option>
            <option value="boolean">真偽値</option>
            <option value="select">選択</option>
          </select>
        </div>
      </div>
      <div if={isTypeSelect(opts.i)}>
        <h4>選択肢</h4>
        <object-schema-item-attribute-select-item each={option, j in opts.attribute.options} option={option} is_login={parent.opts.is_login} parent={parent} object_schema={parent.opts.object_schema} attribute_idx={parent.opts.i} option_idx={j}/>
        <div class="ui grid segment no-boader">
          <div class="one wide column">
            <button if={opts.is_login} type="button" class="plus circular ui icon button" onclick={pushNewOption}>
              <i class="plus icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="one wide column">
      <button if={opts.is_login} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteThisAttribute.bind(this, opts.i)}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>
  <script>
    this.contentEditableAttributeNames = [];
    this.contentEditableAttributeIdentifiers = [];
    this.initialOptionValue = {
      identifier: "new_option",
      name: "新規オプション"
    };

    isTypeSelect(i) {
      if (opts.object_schema.attributes[i].type === 'select') {
        return true;
      } else {
        return false;
      }
    }

    editableThisAttributeName(i) {
      this.contentEditableAttributeNames[i] = this.isLogin;
      this.update();
    }

    editableThisAttributeIdentifier(i) {
      this.contentEditableAttributeIdentifiers[i] = this.isLogin;
      this.update();
    }


    completeAttributeNameEditing(i, evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object_schema.attributes[i].name || evt.target.value === '') {
        return true;
      }

      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].name = evt.target.value;

      opts.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);


      evt.target.blur();
      this.contentEditableAttributeNames[i] = false;

    }

    completeAttributeIdentifierEditing(i, evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object_schema.attributes[i].identifier || evt.target.value === '') {
        return true;
      }

      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].identifier = evt.target.value;

      opts.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);


      evt.target.blur();
      this.contentEditableAttributeIdentifiers[i] = false;

    }

    onChangeSelectAttributeType(i, evt) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].type = evt.target.value;

      opts.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);

    }

    insertAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.splice(i, 0, opts.parent.initialAttributeValue);

      opts.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    deleteThisAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.splice(i, 1);

      opts.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    pushNewOption(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[opts.i].options.push(this.initialOptionValue);

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

  </script>
</object-schema-item-attribute>
