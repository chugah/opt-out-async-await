/* JSON Web Service at https://cloud.email.myplanportal.com/opt-out-async-json*/
<script runat="server">
  Platform.Load("core","1");

  var jsonpost = Platform.Request.GetPostData()
  var json = Platform.Function.ParseJSON(jsonpost);

  var pin = json.pin;
  var opt_out = json.opt_out;

  try {
    addRow();
    Write('1');

  } catch (err) {
    Write('0');
  } 

  function addRow() {
  var activitiesDE = DataExtension.Init('P02_Opt_Out_Member_Outreach_Data');
  var activitiesRows = activitiesDE.Rows.Add({ pin: pin, opt_out: opt_out, opt_out_date: Now() });
  }
</script>

/* JS UI File */
const successMsg = () => {
  document.getElementById('processed').innerHTML = 'We have received your request!';
  document.getElementById('rejected').innerHTML = '';
  document.getElementById('pinText').value = '';
}

const postOptOut = async (pin) => {
  const data = {
    pin,
    opt_out: true
  }

  let response = await fetch('https://cloud.email.myplanportal.com/opt-out-async-json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
    
  if (response.status === 200) {
    const result = await response.json();
    if (result == '1') {
      successMsg();
    }
  } else {
    document.getElementById('rejected').innerHTML = 'Your request was not processed. Please try again.';
    throw new Error('error');
  }
}

const showErrMsg = () => {
  document.getElementById('rejected').innerHTML = 'Please enter a PIN.';
  document.getElementById('pinText').focus();
}
      
const checkOptOut = () => {  
  const pin = document.getElementById('pinText').value;
  pin === '' ? showErrMsg() : postOptOut(pin);
}
