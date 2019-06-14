function Scheduler() {
  var debugshift = 4;
  var l_month_name_dic = {1:'January', 2:'February', 3:'March', 4:'April',
        5:'May', 6:'June', 7:'July', 8:'August', 9:'September',
        10:'October', 11:'November', 12:'December'};
  var l_weekday_name_list = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
        'Saturday', 'Sunday'];
  var l_C = 'C';
  var l_CP = 'CP';
  var l_P = 'P';
  var l_O = 'O';
  var l_E = 'E';
  
  var s_dic = {};
  s_dic[0] = l_P;
  s_dic[1] = l_C;
  s_dic[2] = l_O;
  s_dic[3] = l_P;

  var app = SpreadsheetApp;
  var ss = app.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Data");

  var year = dataSheet.getRange(1, 2).getValue();
  
  var date = new Date();
//  var resultSheet = ss.insertSheet("Results_" + date);
  
  const SCHEDULE_YEAR = dataSheet.getRange(1, 2).getValue();
  const SCHEDULE_MONTH = dataSheet.getRange(2, 2).getValue();
  
  var ts = ss.getSheetByName('Template').copyTo(ss);
  ss.setActiveSheet(ts);
  ts.setName("Schedule " + String(SCHEDULE_YEAR) + ' ' + l_month_name_dic[SCHEDULE_MONTH] + ' ' + date);
  ts.getRange(1, 6).setValue(SCHEDULE_YEAR + ', ' + l_month_name_dic[SCHEDULE_MONTH]);
  
//  resultSheet.getRange(1, 1).setValue(SCHEDULE_YEAR);
//  resultSheet.getRange(1, 2).setValue(l_month_name_dic[SCHEDULE_MONTH]);

  var lastRow = dataSheet.getLastRow();
  
  var i;
  var j;
  var k;
  var de;
  
  var dataLines = [];
  var nodataLines = [];
  var lineData = [];
  var number_of_vol = 0;
  var available;
  for (i = 6; i <= lastRow; i++) {
    available = dataSheet.getRange(i, 4).getValue();
    if (available){
      lineData = [];
      for (j = 2; j <= 11; j++){
        lineData.push(dataSheet.getRange(i, j).getValue());
      }
      dataLines.push(lineData);
      number_of_vol += 1;
    }
  }
  
//  for (i = 0; i < dataLines.length; i++) {
//    resultSheet.getRange(38 + i, 1).setValue(String(dataLines[i]));
//  }
//  
  var NUMBER_OF_VOLUNTEERS = number_of_vol;
  var volunteers = [];
  for (var i = 0; i < NUMBER_OF_VOLUNTEERS; i++) {
    volunteers.push(i);
  }
  //resultSheet.getRange(debugshift, 1).setValue('volunteers');
  //resultSheet.getRange(debugshift, 2).setValue(String(volunteers));

  var FIRSTDAY_INDEX = new Date(SCHEDULE_YEAR, SCHEDULE_MONTH-1, 0).getDay(); // 0 Monday
  var DAYS_IN_MONTH = new Date(SCHEDULE_YEAR, SCHEDULE_MONTH, 0).getDate();
  //resultSheet.getRange(6, 1).setValue('SCHEDULE_YEAR ' + SCHEDULE_YEAR);
  //resultSheet.getRange(7, 1).setValue('SCHEDULE_MONTH ' + SCHEDULE_MONTH);
  //resultSheet.getRange(8, 1).setValue('FIRSTDAY_INDEX ' + FIRSTDAY_INDEX);
  //resultSheet.getRange(9, 1).setValue('DAYS_IN_MONTH ' + DAYS_IN_MONTH);
  var list_of_days = [];
  for (var i = 1; i <= DAYS_IN_MONTH; i++) {
    list_of_days.push(i);
  }  
  
  if (FIRSTDAY_INDEX == 0){
    var FIRST_MONDAY = 0;
  }
  else{
    var FIRST_MONDAY = 7 - FIRSTDAY_INDEX;
  }

  var weeks = {};
  var m = FIRSTDAY_INDEX;
  var week_index = 0;
  var week_count = 0;
  var d = 1;
  var what_day_dic = {};
  var xfrst = {};
  var yfrst = {};
  while (d <= DAYS_IN_MONTH){
    weeks[week_index] = [];
    while ((d + m - (week_index * 7) < 8) && (d <= DAYS_IN_MONTH)){
      weeks[week_index].push(d);
      what_day_dic[d] = d + m - (week_index * 7) - 1;
      xfrst[d] = 6 + (week_index * 6);
      yfrst[d] = what_day_dic[d] + 2;
      d += 1;
    }
    week_index += 1;
  }
  week_count = week_index;
  for (i = 0; i < week_count ; i++){          
    for (j = 0; j < weeks[i].length; j++){          
      d = weeks[i][j];
      ts.getRange(5 + i * 6, 2 + j).setValue(String(d));
    }
  }
//  resultSheet.getRange(debugshift+1, 1).setValue('what_day_dic[29]');
//  resultSheet.getRange(debugshift+1, 2).setValue(String(what_day_dic[29]));
//  resultSheet.getRange(debugshift+1, 1).setValue('weeks');
//  resultSheet.getRange(debugshift+1, 2).setValue(String(weeks[0]));
//  resultSheet.getRange(debugshift+1, 3).setValue(String(weeks[1]));
//  resultSheet.getRange(debugshift+1, 4).setValue(String(weeks[2]));
//  resultSheet.getRange(debugshift+1, 5).setValue(String(weeks[3]));
//  resultSheet.getRange(debugshift+1, 5).setValue(String(weeks[4]));
//  
  
  var days = [];
  var c;
  var weekdays;
  function certain_weekdays_in_month(c){ // Monday 0
    days = [];
    for (i = 0; i < DAYS_IN_MONTH; i++){       
      d = list_of_days[i];
      if (what_day_dic[d] == c){
        days.push(d);
      }
    }
    return days;
  }                              

  var chat_days = [];
  var not_chat_days = [];
  var cap_d_s = {};
  for (i = 0; i < DAYS_IN_MONTH; i++){       
    d = list_of_days[i];
    cap_d_s[d] = {};

    if (what_day_dic[d] == 0 || what_day_dic[d] == 2){
      chat_days.push(d);
    cap_d_s[d][0] = [];
    cap_d_s[d][1] = [];
    cap_d_s[d][2] = [];
    cap_d_s[d][3] = [];
    }
    else{
      not_chat_days.push(d);
    cap_d_s[d][0] = [];
    cap_d_s[d][2] = [];
    cap_d_s[d][3] = [];
    }
  }
//  resultSheet.getRange(2, 1).setValue('Cset napok: ' + String(chat_days));
  
  var weekend_days = [];
  for (i = 0; i < DAYS_IN_MONTH; i++){       
    d = list_of_days[i];
    if (what_day_dic[d] == 5 || what_day_dic[d] == 6){
      weekend_days.push(d);
    }
  }  
  
  
  // Distance between workdays per person
  var distance = 4;

  // Phone shift 0, Chat shift 1, Observation shift 2,
  // Extra phone shift 3
  var shifts = [0, 1, 2, 3];
  var id;
  var s;

  var all_days_available = [];
  var all_workload = [];
  var all_wants_alone = [];
  var all_cannot_alone = [];
  var all_not_with = [];
  var welcomers = [];
  var observers = [];
  var cannot_work_alone = [];
  var not_with_them = [];
  var v;
  var capacity_d;
  var capacity = {};
  var s_all = [];
  
  // Creates a linear optimization engine.
  var engine = LinearOptimizationService.createEngine();
  
  // Creates constraint lists for use_data.
  var constraint_id = {};
  var constraint_id_d = {};
  
  var constraint_weekend_days = [];
  var constraint_separate_weeks = [];
  
  var these_shifts = [];
  var volunteer_dic = {};
  var volunteer_dic_r = {};
  var av_days_count;
  var cd;
  
  var coeff;
  //engine.setObjectiveCoefficient(variable_name, obj_coeff(s, d));

  function obj_coeff(s, d){
    switch(s){
      case 0:
        // Phone on chat days
        for (j = 0; j < chat_days.length; j++){
            cd = chat_days[j];
            if (d == cd){coeff = 9;}
        // Phone on non-chat days
            else coeff = 10;
        }
        break;
        
      case 1:
        // Chat
        coeff = 8;
        break;
        
      case 2:
        // Observer
        coeff = 5;
        break;
        
      case 3:
        // Extra phone
        for (j = 0; j < chat_days.length; j++){
            cd = chat_days[j];
            if (d == cd){ coeff = 6;}
        // Extra phone on non-chat days
            else coeff = 7;
        }
        break;
    }
    return coeff;
  
  }
  
  var possible_shifts = [];
  
  function use_data(id, type, days_available, workload, max_weekend_days, welcomes_observer, 
          separate_w, alone, cannot_alone, not_with){
          
    volunteer_dic[id] = dataLines[id][0];
    volunteer_dic_r[dataLines[id][0]] = id;
    
    capacity[id] = {};
    constraint_id[id] = {};
    constraint_id_d[id] = {};
    all_days_available.push(days_available);
    all_workload.push(workload);
    
    possible_shifts = [];
    
    // Total workload
    // Create the constraint: 0 <= 1 * id.d.s <= workload
    constraint_id[id] = engine.addConstraint(0, workload);

    // Volunteers doing only chat
    if (type == l_C){
      observers.push(id);
      possible_shifts = l_C;
      if (isNaN(days_available)){
        for (i = 0; i < days_available.length; i++){
          d = days_available[i];
          for (j = 0; j < chat_days.length; j++){
            cd = chat_days[j];
            if (d == cd){
              variable_name = 'shift__' + String(id) + '_' + String(d) + '_1';
              engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
              engine.setObjectiveCoefficient(variable_name, obj_coeff(1, d));
              constraint_id[id].setCoefficient(variable_name, 1);
              cap_d_s[d][1].push(id);
              
              capacity[id][d] = [1];
              
              //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
            }
          }
        }
      }
      else{
        d = days_available[i];
        for (j = 0; j < chat_days.length; j++){
          cd = chat_days[j];
          if (d == cd){
            variable_name = 'shift__' + String(id) + '_' + String(d) + '_1';
            engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
            engine.setObjectiveCoefficient(variable_name, obj_coeff(1, d));
            constraint_id[id].setCoefficient(variable_name, 1);
            cap_d_s[d][1].push(id);
            
            capacity[id][d] = [1];
            
            //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
          }
        }
      }   
    }

    // Volunteers doing chat and phone
      if (type == l_CP){
      observers.push(id);
      if (isNaN(days_available)){
        for (i = 0; i < days_available.length; i++){
          d = days_available[i];
          
          capacity[id][d] = [0, 3];
          
          possible_shifts = l_P;

          // Create the constraint: 0 <= 1 * id.d.0 + 1 * id.d.1 + 1 * id.d.3 <= 1
          constraint_id_d[id][d] = engine.addConstraint(0, 1);
          
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_0';        
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          constraint_id_d[id][d].setCoefficient(variable_name, 1);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(0, d));
          cap_d_s[d][0].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);

          for (j = 0; j < chat_days.length; j++){
            cd = chat_days[j];
            if (d == cd){
              variable_name = 'shift__' + String(id) + '_' + String(d) + '_1';        
              engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
              constraint_id_d[id][d].setCoefficient(variable_name, 1);
              engine.setObjectiveCoefficient(variable_name, obj_coeff(1, d));
//              cap_d_s[d][1] = [];
              cap_d_s[d][1].push(id);
              capacity[id][d].push(1);
              constraint_id[id].setCoefficient(variable_name, 1);
              possible_shifts += l_C;
            }
          }
          
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_3';        
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          constraint_id_d[id][d].setCoefficient(variable_name, 1);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(3, d));
          cap_d_s[d][3].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);  
          
          //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
        }
      }
      else{
        d = days_available;
        
        capacity[id][d] = [0, 3];

        possible_shifts = l_P;

        // Create the constraint: 0 <= 1 * id.d.0 + 1 * id.d.1 + 1 * id.d.3 <= 1 
        constraint_id_d[id][d] = engine.addConstraint(0, 1);
        
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_0';        
        engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
        constraint_id_d[id][d].setCoefficient(variable_name, 1);
        engine.setObjectiveCoefficient(variable_name, obj_coeff(0, d));
        cap_d_s[d][0].push(id);
        constraint_id[id].setCoefficient(variable_name, 1);

        for (j = 0; j < chat_days.length; j++){
          cd = chat_days[j];
          if (d == cd){
            variable_name = 'shift__' + String(id) + '_' + String(d) + '_1';        
            engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
            constraint_id_d[id][d].setCoefficient(variable_name, 1);
            engine.setObjectiveCoefficient(variable_name, obj_coeff(1, d));
            cap_d_s[d][1] = [];
            cap_d_s[d][1].push(id);
            capacity[id][d].push(1);
            constraint_id[id].setCoefficient(variable_name, 1);
            possible_shifts += l_C;
          }
        }
          
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_3';        
        engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
        constraint_id_d[id][d].setCoefficient(variable_name, 1);  
        engine.setObjectiveCoefficient(variable_name, obj_coeff(3, d));
        cap_d_s[d][3].push(id);
        constraint_id[id].setCoefficient(variable_name, 1);
        
        //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
      }   
    }

    // Volunteers doing only phone
    if (type == l_P){
      observers.push(id);
      possible_shifts = l_P;
      if (isNaN(days_available)){
        for (i = 0; i < days_available.length; i++){
          d = days_available[i];
          
          // Create the constraint: 0 <= 1 * id.d.0 + 1 * id.d.3 <= 1
          constraint_id_d[id][d] = engine.addConstraint(0, 1);
          
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_0';        
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          constraint_id_d[id][d].setCoefficient(variable_name, 1);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(0, d));
          cap_d_s[d][0].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);
          
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_3';        
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          constraint_id_d[id][d].setCoefficient(variable_name, 1);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(3, d));
          cap_d_s[d][3].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);

          capacity[id][d] = [0, 3];
          
          //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
        }
      }
      else{
        d = days_available;
        
        // Create the constraint: 0 <= 1 * id.d.0 + 1 * id.d.3 <= 1
        constraint_id_d[id][d] = engine.addConstraint(0, 1);
        
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_0';        
        engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
        constraint_id_d[id][d].setCoefficient(variable_name, 1);
        engine.setObjectiveCoefficient(variable_name, obj_coeff(0, d));
        cap_d_s[d][0].push(id);
        constraint_id[id].setCoefficient(variable_name, 1);
        
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_3';        
        engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
        constraint_id_d[id][d].setCoefficient(variable_name, 1);  
        engine.setObjectiveCoefficient(variable_name, obj_coeff(3, d));
        cap_d_s[d][3].push(id);
        constraint_id[id].setCoefficient(variable_name, 1);
        
        capacity[id][d] = [0, 3];
        
        //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
      }   
    }
    
    // Volunteers doing observation
    if (type == l_O){
      observers.push(id);
      possible_shifts = l_P;
      if (isNaN(days_available)){
        for (i = 0; i < days_available.length; i++){
          d = days_available[i];
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_2';
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(2, d));
          cap_d_s[d][2].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);
          
          capacity[id][d] = [2];
          //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
        }
      }
      else{
        d = days_available;
          variable_name = 'shift__' + String(id) + '_' + String(d) + '_2';
          engine.addVariable(variable_name, 0, 1, LinearOptimizationService.VariableType.INTEGER);
          engine.setObjectiveCoefficient(variable_name, obj_coeff(2, d));
          cap_d_s[d][2].push(id);
          constraint_id[id].setCoefficient(variable_name, 1);
          
          capacity[id][d] = [2];
          //resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(d)+':'+String(possible_shifts));
      }   
    }
    
//    resultSheet.getRange(3, 2 + id).setValue(String(id));
//    resultSheet.getRange(4, 2 + id).setValue(volunteer_dic[id] + ' ' + type);
//    resultSheet.getRange(5, 2 + id).setValue('Megoldás:');

//    resultSheet.getRange(3, 2 + id + NUMBER_OF_VOLUNTEERS).setValue(String(id));
//    resultSheet.getRange(4, 2 + id + NUMBER_OF_VOLUNTEERS).setValue(volunteer_dic[id] + ' ' + type);
//    resultSheet.getRange(5, 2 + id + NUMBER_OF_VOLUNTEERS).setValue('Kapacitás:');
//    for (i = 0; i < days_available.length; i++){
//      d = days_available[i];
//      capacity_d = capacity[id][d];
//      resultSheet.getRange(5 + d, 2 + id + NUMBER_OF_VOLUNTEERS).setValue(String(d)+':'+String(type));
//    }
//    
//    resultSheet.getRange(3, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(String(id));
//    resultSheet.getRange(4, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue(volunteer_dic[id] + ' ' + type);
//    resultSheet.getRange(5, 2 + id + NUMBER_OF_VOLUNTEERS * 2).setValue('Beolvasás:');
    
//    // Max weekend days
//    var days_available_on_weekends = [];
//    for (i = 0; i < weekend_days.length; i++){
//      d = weekend_days[i];
//      if (d in days_available){
//        days_available_on_weekends.push(d);
//      }
//    }
//    // Create the constraint: 0 <= 1 * id.days_available_on_weekends.s <= max_weekend_days
//    constraint_weekend_days[id] = engine.addConstraint(0, max_weekend_days);
//    if (max_weekend_days > 0){
//      for (i = 0; i < days_available_on_weekends.length; i++){
//        d = days_available_on_weekends[i];
//        for (k = 0; k < 4; k++){          
//          s = shifts[k];
//          variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
//          constraint_weekend_days[id].setCoefficient(variable_name, 1);
//        }
//      }
//    }
//    else{
//      for (i = 0; i < days_available_on_weekends.length; i++){
//        d = days_available_on_weekends[i];
//        for (k = 0; k < 4; k++){          
//          s = shifts[k];
//          variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
//          constraint_weekend_days[id].setCoefficient(variable_name, 0);
//        }
//      }
//    }

    // List observers and volunteers welcoming observers
    if (type in [l_C, l_CP, l_P] && welcomes_observer){
      welcomers.push(id);
    }

//    // Wants shifts to be on different weeks 
//    if (separate_w){
//      constraint_separate_weeks[id] = [];
//      for (i in weeks){
//        constraint_separate_weeks[id][i] = engine.addConstraint(0, 1);
//        for (j = 0; j < weeks[i].length; j++){          
//          d = weeks[i][j];
//          // Create the constraint for each week: 0 <= 1 * id.d.s <= 1
//          if (d in days_available){
//            for (k = 0; k < 4; k++){          
//              s = shifts[k];
//              variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
//              constraint_separate_weeks[id][i].setCoefficient(variable_name, 1);
//            }
//          }
//        }
//      }
//    }
   
    // Wants to work alone
    if (alone){
      all_wants_alone.push(id);
    }

    // Cannot work alone
    if (cannot_alone){
      all_cannot_alone.push(id);
    }    

    // Does not want to work with XY
    if (not_with){
      not_with_them[id] = [];
      not_with_them[id].push([not_with]);
    }
  }
  
//  // volunteer_dic = ID name, volunteer_dic_r = name ID
//  for (id = 0; id < NUMBER_OF_VOLUNTEERS; id++) {
//    
//  } 

  function bool_from_string(value){
    if (value == '1'){
      return true;
    }
    else{
      return false;
    }
  }
 
  // Loads data
  id = 0;
  var type;
  var days_available = [];
  var workload;
  var max_weekend_days;
  var welcomes_observer;
  var separate_w;
  var alone;
  var cannot_alone;
  var not_with;
  var input;
  for (input = 0; input < NUMBER_OF_VOLUNTEERS; input++){       
    values = dataLines[input];
    type = values[1];
    
    if (isNaN(values[2])){
    days_available = values[2].split(',').map(Number);
    }
    else{
      days_available = [values[2]];
    }

    workload = Number(values[3]);

    max_weekend_days = Number(values[4]);

    welcomes_observer = bool_from_string(values[5]);
    separate_w = bool_from_string(values[6]);
    alone = bool_from_string(values[7]);
    cannot_alone = bool_from_string(values[8]);

    if (values[9]){
      not_with = values[9].split(',');
    }
    else{
      not_with = false;
    }  
      
    use_data(id, type, days_available, workload, max_weekend_days,
      welcomes_observer, separate_w, alone, cannot_alone, not_with)
    id += 1
  }
  
  // Maximum one volunteer per shift.
  var constraint_shift = {};
  var ncd;
  var n;
  var ids = [];
//  resultSheet.getRange(40, 1).setValue('Egy helyre több ember szabad:');
  for (i = 0; i < DAYS_IN_MONTH; i++){       
    d = list_of_days[i];
    constraint_shift[d] = {};
    
    constraint_shift[d][0] = engine.addConstraint(0, 1);
    ids = cap_d_s[d][0];
    if (ids.length > 1){
//      resultSheet.getRange(40 + d * 4, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]] + ' T');
      for (j = 0; j < ids.length; j++){      
        id = ids[j];
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_0';
        constraint_shift[d][0].setCoefficient(variable_name, 1);
//        resultSheet.getRange(40 + d * 4, 2 + j).setValue('T ' + String(volunteer_dic[id]));
      }
    }
    
    constraint_shift[d][2] = engine.addConstraint(0, 1);
    ids = cap_d_s[d][2];
    if (ids.length > 1){
//      resultSheet.getRange(43 + d * 4, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]] + ' H');
      for (j = 0; j < ids.length; j++){      
        id = ids[j];
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_2';
        constraint_shift[d][2].setCoefficient(variable_name, 1);
//        resultSheet.getRange(43 + d * 4, 2 + j).setValue('H ' + String(volunteer_dic[id]));
      }
    }
    
    constraint_shift[d][3] = engine.addConstraint(0, 1);
    ids = cap_d_s[d][3];
    if (ids.length > 1){
//      resultSheet.getRange(42 + d * 4, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]] + ' E');
      for (j = 0; j < ids.length; j++){      
        id = ids[j];
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_3';
        constraint_shift[d][3].setCoefficient(variable_name, 1);
//        resultSheet.getRange(42 + d * 4, 2 + j).setValue('E ' + String(volunteer_dic[id]));
      }
    }
  }
  
  for (i = 0; i < chat_days.length; i++){       
    d = chat_days[i];
    constraint_shift[d][1] = engine.addConstraint(0, 1);
    ids = cap_d_s[d][1];
    if (ids.length > 1){
//      resultSheet.getRange(41 + d * 4, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]] + ' C');
      for (j = 0; j < ids.length; j++){      
        id = ids[j];
        variable_name = 'shift__' + String(id) + '_' + String(d) + '_1';
        constraint_shift[d][0].setCoefficient(variable_name, 1);
//        resultSheet.getRange(41 + d * 4, 2 + j).setValue('C ' + String(volunteer_dic[id]));
      }
    }
  }
  

  // At least four days between shifts per volunteer
  var constraint_distance = {};
  var ab_days = [];
  var day;
  var s_all_2;
  var d_2;
  for (j = 0; j < NUMBER_OF_VOLUNTEERS; j++){ //b
    n = 0;
    id = volunteers[j];
    av_days_count = all_days_available[id].length;
    constraint_distance[id] = {};
    
    for (i = 0; i < av_days_count; i++){
      d = all_days_available[id][i];
      s_all = capacity[id][d]; // all shifts d
      constraint_distance[id][d] = {};
      for (k = 0; k < av_days_count; k++){
        d_2 = all_days_available[id][k];
        s_all_2 = capacity[id][d_2]; // all shifts d_2
        
        if ((d < d_2) && (Math.abs(d - d_2) < distance)){
            constraint_distance[id][d][d_2] = {};
            constraint_distance[id][d][d_2] = engine.addConstraint(0, 1);
                        
              if (isNaN(s_all) && isNaN(s_all_2)){
                for (c = 0; c < s_all.length; c++){          
                  s = s_all[c];
                  variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
                  constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                }
                for (c = 0; c < s_all_2.length; c++){          
                  s = s_all_2[c];
                  variable_name = 'shift__' + String(id) + '_' + String(d_2) + '_' + String(s);        
                  constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                }
              }
              
              if (isNaN(s_all) && !isNaN(s_all_2)){
                for (c = 0; c < s_all.length; c++){          
                  s = s_all[c];
                  variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
                  constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                }
                variable_name = 'shift__' + String(id) + '_' + String(d_2) + '_' + String(s_all_2);        
                constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
              }
              
              if (!isNaN(s_all) && isNaN(s_all_2)){
                variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s_all);        
                constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                for (c = 0; c < s_all_2.length; c++){          
                  s = s_all_2[c];
                  variable_name = 'shift__' + String(id) + '_' + String(d_2) + '_' + String(s);        
                  constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                }
              }
              
              if (!isNaN(s_all) && !isNaN(s_all_2)){
                variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s_all);        
                constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
                variable_name = 'shift__' + String(id) + '_' + String(d_2) + '_' + String(s_all_2);        
                constraint_distance[id][d][d_2].setCoefficient(variable_name, 1);
              }
        }
      }
    }
  } //b
  
  
  
  /*
  // Observers only work with volunteers they are welcomed by
    for d in list_of_days:
        for o in observers:
            for v in volunteers:
                if v not in welcomers:
                    for s in [0, 1, 3]:
                        model.Add(schedule[(o, d, 2)] + schedule[(v, d, s)] <=1)

    // Cannot work alone
    for id in all_cannot_alone:
        days = [d for d in all_days_available[id]]
        others = [i for i in volunteers if i != id
                and i not in all_cannot_alone]
        other_not_alones = [i for i in all_cannot_alone if i != id]
        for d in days:
            // Only can work on a day when other volunteer works who
            // can work alone
            model.Add(sum(schedule[(id, d, s)] for s in shifts)
                    <= sum(schedule[(v, d, s)] for v in others for s in shifts))
            // Cannot work on the same day as other volunteer who
            // cannot work alone
            model.Add(sum(schedule[(id, d, s)] for s in shifts)
                    and sum(schedule[(v, d, s)]
                    for v in other_not_alones for s in shifts) == False)

    // Does not want to work with XY
    for not_want in not_with_them:
        them = not_want[1]
        days = [d for d in all_days_available[not_want[0]]]
        for d in days:
            model.Add(sum(schedule[(not_want[0], d, s)] for s in shifts)
                    and sum(schedule[(v, d, s)]
                    for v in them for s in shifts) == False)
   */
  
  // Engine should maximize the objective.
  engine.setMaximization();
  
  // Solve the linear program
  var solution = engine.solve();
  var sc;
  var x;
  var y;
  var sol = {};
  
  if (!solution.isValid()) {
    Logger.log('No solution ' + solution.getStatus());
  } 
  else {//a
    for (i = 0; i < not_chat_days.length; i++){
      d = not_chat_days[i];
//      resultSheet.getRange(5 + d, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]]);
    }
    for (i = 0; i < chat_days.length; i++){
      d = chat_days[i];
//      resultSheet.getRange(5 + d, 1).setValue(String(d) + ' ' + l_weekday_name_list[what_day_dic[d]] + ' C');
    }
    for (j = 0; j < NUMBER_OF_VOLUNTEERS; j++){//b
      id = volunteers[j];
      sol[id] = '';
      av_days_count = all_days_available[id].length;
      for (i = 0; i < av_days_count; i++){//c
        d = all_days_available[id][i]; //one day
        y = yfrst[d];

        s_all = capacity[id][d]; // all shifts on this day
        if (!(typeof s_all === 'undefined')) {
            
          if (isNaN(s_all)){
            for (c = 0; c < s_all.length; c++){          
              s = s_all[c];
              variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);
              if (solution.getVariableValue(variable_name) == 1){
//                resultSheet.getRange(5 + d, 2 + id).setValue(String(d)+ '-' + String(s_dic[s]));
                x = xfrst[d] + s;
                ts.getRange(x, y).setValue(String(s_dic[s]) + '-' + volunteer_dic[id]);
                //ts.getRange(x, y).setValue('d' + String(d) + String(s_dic[s]) + '-' + volunteer_dic[id] + ' s' +String(s) + ' x' +String(x) + ' y' +String(y));
                sol[id] += String(d) + String(s_dic[s]) + ' ';
              }
            }
          }
          else{
            s = s_all;
            variable_name = 'shift__' + String(id) + '_' + String(d) + '_' + String(s);        
            if (solution.getVariableValue(variable_name) == 1){
//              resultSheet.getRange(5 + d, 2 + id).setValue(String(d)+ '-' + String(s_dic[s]));
                x = xfrst[d] + s - xfrst[d] * 9;
                ts.getRange(x, y).setValue(String(s_dic[s]) + '-' + volunteer_dic[id]);
                //ts.getRange(x, y).setValue('d' +String(d) + String(s_dic[s]) + '-' + volunteer_dic[id]+ ' s' +String(s) + ' x' +String(x) + ' y' +String(y));
                sol[id] += String(d) + String(s_dic[s]) + ' ';
            }
          }
        }
            
      }//d
    } // b
  }//c
  
  ts.getRange(36, 2).setValue('Programmer: Imre Szakál');
  ts.getRange(36, 4).setValue('imreszakal.com');
  
  for (j = 0; j < NUMBER_OF_VOLUNTEERS; j++){
    id = volunteers[j];
    ts.getRange(4 + id, 10).setValue(volunteer_dic[id]);
    ts.getRange(4 + id, 11).setValue(sol[id]);    
  }
  
}

