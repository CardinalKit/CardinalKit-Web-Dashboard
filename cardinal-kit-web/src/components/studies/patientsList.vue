<template>
  <div class="page">
    <h1 class="mb-5 text-muted">Patients</h1>
    <alt-table :columns="columns" pagination :paginationOptions="paginationOptions" @onPagination="handlePagination">
      <template #t-row>
        <tr v-for="(patient, index) in getPageItems" :key="patient.id">
          <td>{{index + 1}}</td>
          <td>
            {{patient.email || 'NN'}}
          </td>
          <td>
            {{patient.id || 'NN'}}
          </td>
          <td>
            <loading-icon v-if="loadingId == patient.id" class="btn-loading button" size="3px"/>
            <span v-else class="btn-view button" @click="handleSelecPatient(patient.id)">
              View
            </span>
            <a class="modal-show button" href="#modal" @click="resetForm(patient)">Edit</a>
            <div class="modal" id="modal">
              <div class="modal-content">
                <a class="modal-hide" href="#">✕</a>
                <h2 class="m-4 text-center">Additional patient info:</h2>
                  <div class="input-form" >
                    <div :class="cl" v-if="errMsg">
                      {{ msg }}
                    </div>
                    <label>Major event name: </label>
                    <input v-model="majorEventName" name="majorEventName" type="text" placeholder="Event name" />
                    <!-- TODO: 
                      1) add a test here to see if the patient has any tasks set
                      OR
                      2) make a way to be able to reset relative dates
                     -->
                    <h4 v-if="majorEventDate">Use caution when changing {{ majorEventName }} date. 
                      <br />
                      This will not change any events set by relative dates </h4>
                    <label>{{ majorEventName }} date: </label>
                    <input v-model="majorEventDate" name="majorEventDate" type="datetime-local" />
                    <br />
                    <div class="form-group text-center inline">
                      <a @click="saveMajorEvent" class="m-1 button" >
                        Save
                      </a>
                      <a href="#" class="m-1 button">Cancel</a>
                    </div>
                  </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </alt-table>
  </div>
</template>
<script>
import altTable from '@/components/tables/altTable';
import loadingIcon from "@/components/loading";
import modal from "@/components/modals/modal.vue";
import { mapActions, mapGetters } from "vuex";
import moment from 'moment';
  export default {
    name: 'name',
    props: {
      patients:{
        type:Array,
        required:true
      },
      studyId:{
        type:String,
        required:true
      }
    },
    components:{
      altTable,
      loadingIcon,
      modal,
    },
    data(){
      return{
        columns: [{ header: 'N°' }, { header: 'Email' } ,{header: 'userId'},{ header: 'Action' },{ header: '' }],
        loadingId : 0,
        currentPage: 1,
        limit: 10,
        majorEventDate: null,
        majorEventName: null,
        errMsg: false,
      }
    },
    methods: {
      ...mapActions("patient", ["AddPatientData"]),
      handleSelecPatient(patientId){
        this.loadingId = patientId
        this.$router.push({name: "healthUser", query: {studyId: this.studyId, userId: patientId }})
      }, 
      handlePagination(pagination) {
        this.currentPage=pagination.currentPage
        this.limit=pagination.limit
        let total = this.patients.length
        if(this.currentPage > Math.ceil(total/this.limit)){
          this.currentPage = Math.ceil(total/this.limit)
        }
      },
      saveMajorEvent(){
        this.cl = ""
        this.msg = ""
        this.errMsg=false
        if(!this.majorEventDate){
          this.errMsg = true
          this.msg = "majorEvent date is missing"
          this.cl = "alert-err"
        }else if (!this.majorEventName) {
          this.errMsg = true
          this.msg = "majorEvent name is missing"
          this.cl = "alert-err"
        }else if(!this.patient.id) {
          this.errMsg = true
          this.msg = "Patient info is missing. Please contact administrator"
          this.cl = "alert-err"
        }

        if(!this.errMsg){
          let data = {
            studyId: this.studyId,
            userId: this.patient.id,
            payload:{
              majorEventDate: new Date(this.majorEventDate),
              majorEventName: this.majorEventName,
            }
          }
          this.AddPatientData(data)
          this.errMsg = true
          this.cl = 'alert-success'
          this.msg = `Added ${Object.keys(data.payload)} sucessfully`

        }
      }, 
      resetForm(patient){
        this.cl = ""
        this.msg = ""
        this.errMsg= false
        this.patient = patient
        if(this.patient.majorEventDate){
          this.majorEventDate=moment(this.patient.majorEventDate.toDate()).format('YYYY-MM-DDTHH:mm')
        } else {
          this.majorEventDate=null
        }
        if(this.patient.majorEventName){
          this.majorEventName=this.patient.majorEventName
        } else {
          this.majorEventName=null
        }
      },
    },
    computed:{
      paginationOptions() {
        return {
          limit: [10, 20],
          total: this.patients?.length,
          currentPage: this.currentPage,
        };
      },
      getPageItems() {
        let items = this.patients;
        let lowerLimit = (this.currentPage - 1) * this.limit;
        let upperLimit = this.currentPage * this.limit;
        return items.slice(lowerLimit, upperLimit);
      },
    }
  };
</script>
<style lang="scss" scoped>
  .btn-view{
    padding: 0.4rem 0.8em;
    margin-right: 0.1rem;
    background: #b71540;
    color: white;
  }
  .btn-loading{
    width: 3.4em;
    padding: 0.4rem 0.8em;
    margin-right: 0.1rem;
    background: black;
    color: white;
  }
  .modal-show{
    padding: 0.4rem 0.8em;
    margin-right: 0.1rem;
    background: black;
    color: white;
  }
</style>