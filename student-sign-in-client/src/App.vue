<template>
  <div>
    <new-student-form v-on:student-added="newStudentAdded"></new-student-form>
    <student-table v-bind:students="students" 
    v-on:student-arrived-or-left='studentArrivedOrLeft'
    v-on:delete-student='studentDeleted'></student-table>
    <student-message v-bind:student="mostRecentStudent"></student-message>
  </div>
</template>

<script>
import NewStudentForm from './components/NewStudentForm.vue'
import StudentMessage from './components/StudentMessage.vue'
import StudentTable from './components/StudentTable.vue'

export default {
  name: 'App',
  components: {
    NewStudentForm,
    StudentMessage,
    StudentTable,
  },
  mounted() {
    //Load all students, by making a request to API
    this.updateStudents()
  },
  data() {
    return {
      students:[],
      mostRecentStudent:{}
    }
  },
  methods: {
    updateStudents() {
      this.$student_api.getAllStudents().then( students => {
        this.students = students
      }).catch( () => alert('Undable to fetch student list'))
    },
    newStudentAdded(student) {
      this.$student_api.addStudent(student).then( () => {
        this.updateStudents()
      }).catch( err => {
        let msg = err.response.data.join(',')
        alert('Error adding student  \n' + msg)
      })
    },
    studentArrivedOrLeft(student, present) {
      student.present = present // update present value
      this.$student_api.updateStudent(student).then( () => {
        this.mostRecentStudent = student
        this.updateStudents()
      }).catch( () => alert('Unable to update student'))
    },
    studentDeleted(student) {
      this.$student_api.deleteStudent(student.id).then( () => {
        this.updateStudents()
        this.mostRecentStudent = {} //Clear welcome/goodbye message
      }).catch( () => alert('Unable to delete student'))
    }
  }
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css'
</style>
