<template>
  <form
    class="m-2"
    @submit.prevent="onSubmit">
    <div
      v-if="calledfromnewpoll"
      class="formgroup">
      <label for="title">Title:</label>
      <input
        v-validate="'required'"
        :class="{error : errors.has('title'), success: checkSuccess('title')}"
        v-model="title"
        name="title"
        type="text"
        class="form-control">
      <span
        v-if="errors.has('title')"
        class="errorText">{{ errors.first('title') }}</span>
    </div>
    <div
      v-if="calledfromnewpoll"
      class="formgroup">
      <label for="description">Description:</label>
      <textarea
        v-validate="'required'"
        id="description"
        :class="{error : errors.has('description'), success: checkSuccess('description')}"
        v-model="description"
        name="description"
        class="form-control"
        cols="5"
        rows="3"/>
      <span
        v-if="errors.has('description')"
        class="errorText">{{ errors.first('description') }}</span>
    </div>
    <div class="formgroup">
      <Label
        v-if="calledfromnewpoll"
        for="options">Voting Options:</Label>
      <Label
        v-else
        for="options">Add some voting options</Label>
      <button
        class="btn btn-info m-2"
        type="button"
        @click="addOption">Add Option</button>
      <div
        v-for="(optionInputs, index) in optionInputs"
        :key="optionInputs.id"
        class="form-inline">
        <label :for="optionInputs.id">Option #{{ index + 1 }}: Title:</label>
        <input
          v-validate="'required'"
          :name="`# ${index + 1} title`"
          :class="{error : errors.has(`# ${index + 1} title`), success: checkSuccess(`# ${index + 1} title`)}"
          :id="optionInputs.id"
          v-model="optionInputs.value"
          class="form-control m-2"
          type="text">
        <label for="color">Color:</label>
        <select
          v-validate="'required'"
          :name="`# ${index + 1} color`"
          :class="{error : errors.has(`# ${index + 1} color`), success: checkSuccess(`# ${index + 1} color`)}"
          :id="optionInputs.id"
          v-model="optionInputs.color"
          :style="({backgroundColor: optionInputs.color ? optionInputs.color.colorRGBA : ''})"
          class="form-control m-2"
          @change="updateColorTaken(optionInputs.color)">
          <option
            v-for="color in colors"
            :disabled="color.taken"
            :style="({backgroundColor: color.colorRGBA})"
            :key="color.colorName"
            :value="color"
            class=""
          >{{ color.colorName }}</option>
        </select>
        <button
          class="btn btn-warning"
          type="button"
          @click="deleteOption(optionInputs.id)">X</button>
        <span
          v-if="errors.has(`# ${index + 1} title`)"
          class="errorText">{{ errors.first(`# ${index + 1} title`) }}</span>
        <span
          v-if="errors.has(`# ${index + 1} color`)"
          class="errorText">{{ errors.first(`# ${index + 1} color`) }}</span>
      </div>
    </div>
    <span
      v-if="checkOptionsInput"
      class="errorText">{{ optionsError }}</span>
    <span
      v-if="showMaxOptionsMessage"
      class="errorText">Sorry no more than 10 options</span>
    <div
      v-if="userAddingOptionsFromPoll"
      class="form-group d-flex mt-2">
      <div class="ml-auto d-flex flex-column">
        <button
          type="submit"
          class="btn btn-primary align-self-end">Submit</button>
        <span
          v-if="fixForm"
          class="errorText">Please fix form errors before submission</span>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    calledfromnewpoll: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    existingpollcolors: {
      type: Array,
      default: function () {
        return []
      }
    },
    existingpolloptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    id: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      title: '',
      description: '',
      optionInputs: [],
      colors: [
        {
          colorName: 'Teal',
          colorRGBA: 'rgba(0,128,128,0.5)',
          taken: false},
        {
          colorName: 'Aqua',
          colorRGBA: 'rgba(0,255,255,0.5)',
          taken: false},
        {
          colorName: 'Coral',
          colorRGBA: 'rgba(255,127,80,0.5)',
          taken: false},
        {
          colorName: 'Corn Flower Blue',
          colorRGBA: 'rgba(100,149,237,0.5)',
          taken: false},
        {
          colorName: 'Crimson',
          colorRGBA: 'rgba(220,20,60,0.5)',
          taken: false},
        {
          colorName: 'Violet',
          colorRGBA: 'rgba(238,130,238,0.5)',
          taken: false},
        {
          colorName: 'Sea Green',
          colorRGBA: 'rgba(46,139,87,0.5)',
          taken: false},
        {
          colorName: 'Dark Orange',
          colorRGBA: 'rgba(255,140,0,0.5)',
          taken: false},
        {
          colorName: 'Yellow',
          colorRGBA: 'rgba(244,235,66,0.5)',
          taken: false},
        {
          colorName: 'Dark Violet',
          colorRGBA: 'rgb(148,0,211,0.5)',
          taken: false}
      ],
      fixForm: false,
      optionsError: '',
      submitTried: false,
      showMaxOptionsMessage: false
    }
  },
  computed: {
    userAddingOptionsFromPoll () {
      if (this.calledfromnewpoll) {
        return true
      } else {
        if (this.optionInputs.length > 0) {
          return true
        } else {
          return false
        }
      }
    }
  },
  created () {
    if (this.existingpollcolors.length > 0) {
      this.existingpollcolors.forEach(color => {
        this.colors.forEach(c => {
          if (color === c.colorRGBA) {
            c.taken = true
          }
        })
      })
    }
  },
  methods: {
    ...mapActions([
      'submitPollEdit',
      'submitNewPoll',
      'submitAddOptionToPoll'
    ]),
    addOption () {
      if (this.optionInputs.length === 10 || this.existingpolloptions.length === 10) {
        this.showMaxOptionsMessage = true
        return
      }
      this.submitTried = false
      const newOption = {
        id: Math.random() * Math.random() * 1000,
        value: '',
        color: null
      }
      this.optionInputs.push(newOption)
    },
    deleteOption (id) {
      this.optionInputs.forEach(option => {
        if (option.id === id) {
          if (option.color) {
            option.color.taken = !option.color.taken
          }
        }
      })
      this.optionInputs = this.optionInputs.filter(option => option.id !== id)
    },
    updateColorTaken (colorChosen) {
      colorChosen.taken = !colorChosen.taken
    },
    checkSuccess (field) {
      let thisField
      if (!isNaN(Number(field.split(' ')[1]))) {
        thisField = this.optionInputs[field.split(' ')[1] - 1]
        thisField = thisField.value
      } else {
        thisField = this[field]
      }
      return !this.errors.has(`${field}`) && thisField.length > 0
    },
    onSubmit () {
      this.submitTried = true
      this.$validator.validateAll().then((valid) => {
        if (valid) {
          if (!this.checkOptionsInput()) {
            this.fixForm = true
            return
          }
          this.fixForm = false
          if (this.calledfromnewpoll) {
            const formData = {
              title: this.title,
              description: this.description,
              options: this.optionInputs
            }
            this.editing ? this.submitPollEdit(formData) : this.submitNewPoll(formData)
          } else {
            const newOptions = {
              id: this.id,
              options: this.optionInputs
            }
            this.submitAddOptionToPoll(newOptions)
          }
          this.$emit('form-submitted')
          this.resetForm()
        } else {
          this.fixForm = true
        }
      })
    },
    resetForm () {
      this.editing = false
      this.title = ''
      this.description = ''
      this.optionInputs = []
      this.colors.map(color => { color.taken = false })
      this.fixForm = false
      this.optionsError = ''
      this.submitTried = false
    },
    checkOptionsInput () {
      if (this.optionInputs.length < 2 && this.submitTried && this.calledfromnewpoll) {
        this.optionsError = 'Please add at least 2 options for voting'
        return false
      } else {
        let dupCheck = false
        this.optionInputs.forEach((input, index) => {
          this.optionInputs.forEach((inp, ind) => {
            if (input.value === inp.value && index !== ind) {
              dupCheck = true
            }
          })
          if (this.existingpolloptions.includes(input.value)) {
            dupCheck = true
          }
        })
        if (dupCheck) {
          this.optionsError = 'Please make sure each voting option is unique'
          return false
        } else {
          this.optionsError = ''
          return true
        }
      }
    }
  }
}
</script>

<style>
.errorText {
  color: firebrick;
}
.error {
  border: 1px solid firebrick;
  box-shadow: 0 0 0 .125em rgba(255,56,96,.25);
}
.success {
  border: 1px solid #42b883;
  box-shadow: 0 0 0 .125em rgba(68, 238, 90, 0.479);
}
</style>
