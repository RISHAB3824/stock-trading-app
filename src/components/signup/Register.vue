<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">
        <div class="input" :class="{ invalid: $v.username.$error }">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            @blur="$v.username.$touch()"
          />
          <p v-if="!$v.username.alpha">
            Username can only be 6 characters long text without white-spaces
          </p>
          <p v-if="!$v.username.required">This field must not be empty</p>
          <p v-if="!$v.username.maxLen">
            Username cannot be morethan 6 characters long
          </p>
        </div>
        <div class="input" :class="{ invalid: $v.email.$error }">
          <label for="email">Mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @blur="$v.email.$touch()"
          />
          <p v-if="!$v.email.email">Please provide a valid email address</p>
          <p v-if="!$v.email.required">This field must not be empty</p>
        </div>
        <div class="input" :class="{ invalid: $v.age.$error }">
          <label for="age">Your Age</label>
          <input
            type="number"
            id="age"
            @blur="$v.age.$touch()"
            v-model.number="age"
          />
          <p v-if="!($v.age.minVal && $v.age.maxVal)">
            You have to be atleast 18 and atmost 80
          </p>
          <p v-if="!$v.age.required">This field must not be empty</p>
        </div>
        <div class="input" :class="{ invalid: $v.password.$error }">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            @blur="$v.password.$touch()"
            v-model="password"
          />
          <p v-if="!$v.password.required">This field must not be empty</p>
          <p v-if="!$v.password.minLen">
            Password cannot be morethan 6 characters lon
          </p>
        </div>
        <div class="input" :class="{ invalid: $v.confirmPassword.$error }">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            @blur="$v.confirmPassword.$touch()"
            v-model="confirmPassword"
          />
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
              class="input"
              v-for="(hobbyInput, index) in hobbyInputs"
              :class="{ invalid: $v.hobbyInputs.$each[index].$error }"
              :key="hobbyInput.id"
            >
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                type="text"
                :id="hobbyInput.id"
                @blur="$v.hobbyInputs.$each[index].value.$touch()"
                v-model="hobbyInput.value"
              />
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">
                X
              </button>
            </div>
            <p v-if="!$v.hobbyInputs.minLen">
              You have to specify at least
              {{ $v.hobbyInputs.$params.minLen.min }} hobbies.
            </p>
            <p v-if="!$v.hobbyInputs.required">Please add hobbies.</p>
          </div>
        </div>
        <div class="input inline" :class="{invalid: !$v.terms.$model}">
          <input type="checkbox" id="terms"    @change="$v.terms.$touch()" v-model="terms" />
          <label for="terms">Accept Terms of Use</label>
        </div>
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid || !$v.terms.$model">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {
  required,
  email,
  alpha,
  maxLength,
  minLength,
  maxValue,
  minValue,
  sameAs
} from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      username: '',
      email: '',
      age: null,
      password: '',
      confirmPassword: '',
      country: 'usa',
      hobbyInputs: [],
      terms: false
    }
  },
  validations: {
    username: {
      required,
      alpha,
      maxLen: maxLength(6)
    },
    email: {
      required,
      email
    },
    age: {
      required,
      minVal: minValue(16),
      maxVal: maxValue(80)
    },
    password: {
      required,
      minLen: minLength(6)
    },
    confirmPassword: {
      sameAs: sameAs('password')
    },
    terms: {
      required
    },
    hobbyInputs: {
      minLen: minLength(2),
      $each: {
        value: {
          required,
          alpha,
          minLen: minLength(5)
        }
      }
    }
  },
  methods: {
    onAddHobby () {
      const newHobby = {
        id: Math.random() * Math.random() * 1000,
        value: ''
      }
      this.hobbyInputs.push(newHobby)
    },
    onDeleteHobby (id) {
      this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
    },
    onSubmit () {
      const formData = {
        username: this.username,
        email: this.email,
        age: this.age,
        password: this.password,
        confirmPassword: this.confirmPassword,
        country: this.country,
        hobbies: this.hobbyInputs.map(hobby => hobby.value),
        terms: this.terms
      }
      this.$store.dispatch('signup', formData)
    }
  }
}
</script>

<style scoped>
.signup-form {
  width: 400px;
  margin: 30px auto;
  border: 1px solid #eee;
  padding: 20px;
  box-shadow: 0 2px 3px #ccc;
}

.input.invalid input {
  border: 1px solid red;
  background-color: #ffc9aa;
}

.input.invalid label {
  color: red;
}

.input.inline.invalid label {
  color: red;
}

.input p {
  color: red;
}

.input {
  margin: 10px auto;
}

.input label {
  display: block;
  color: #4e4e4e;
  margin-bottom: 6px;
}

.input.inline label {
  display: inline;
}

.input input {
  font: inherit;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

.input.inline input {
  width: auto;
}

.input input:focus {
  outline: none;
  border: 1px solid #521751;
  background-color: #eee;
}

.input select {
  border: 1px solid #ccc;
  font: inherit;
}

.hobbies button {
  border: 1px solid #521751;
  background: #521751;
  color: white;
  padding: 6px;
  font: inherit;
  cursor: pointer;
}

.hobbies button:hover,
.hobbies button:active {
  background-color: #8d4288;
}

.hobbies input {
  width: 90%;
}

.submit button {
  border: 1px solid #521751;
  color: #521751;
  padding: 10px 20px;
  font: inherit;
  cursor: pointer;
}

.submit button:hover,
.submit button:active {
  background-color: #521751;
  color: white;
}

.submit button[disabled],
.submit button[disabled]:hover,
.submit button[disabled]:active {
  border: 1px solid #ccc;
  background-color: transparent;
  color: #ccc;
  cursor: not-allowed;
}
</style>
