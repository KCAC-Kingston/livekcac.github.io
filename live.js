//import "splash_style.css";

const CURRENT_SERVICE_QUERY = `
query CurrentService {
  currentService(onEmpty: LOAD_NEXT) {
    id
    startTime
    endTime
    content {
      title
    }
  }
}
`;

async function startCountdown() {
  // Fetch the current or next service data
  const service = await fetch("https://liveservice.kcac.ca/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: CURRENT_SERVICE_QUERY,
      operationName: "CurrentService",
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

  // If no service was returned from the API, don't display the countdown
  if (!service.data.currentService || !service.data.currentService.id) {
    return;
  }

  // Set the service title
  serviceName = service.data.currentService.content.title;
  document.getElementById("serviceTitle").innerText =
    service.data.currentService.content.title;

  // Set the date we're counting down to
  const startTime = new Date(service.data.currentService.startTime).getTime();
  const endTime = new Date(service.data.currentService.endTime).getTime();

  // Create a one second interval to tick down to the startTime
  const intervalId = setInterval(function () {
    const now = new Date().getTime();

    // If we are between the start and end time, the service is live
    if (now >= startTime && now <= endTime) {
      clearInterval(intervalId);
      document.getElementById("countdown").innerHTML =
        "Our service is now live, we're redirecting you.";
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') == -1;
        if (!isWeixin) {
        window.location.href = "https://live.kcac.ca/wx"
        }
        else{
         window.location.href = "https://liveservice.kcac.ca"
        }
      return;
    }

    // Find the difference between now and the start time
    const difference = startTime - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Display the results in the element with id="countdown"
    document.getElementById(
      "countdown"
    ).innerHTML = `${days} Days, ${hours} Hours, ${minutes} Minutes`;

    if(serviceName.includes("combined")|| serviceName.includes("Combined")||serviceName.includes("联合"||serviceName.includes("聯合"))){
      comboText = '<br>'+'Please Note this week we will have a combined Sunday Serivce starting at 10AM!' 
      +'<br>'+
      '请注意本周我们将会有主日联合崇拜,十點開始。' + '<br> <br>';
      //console.log("combo Service Detected");
      document.getElementById("comboService").innerHTML = comboText;
      
    }
    // If we are past the end time, clear the countdown
    if (difference < 0) {
      clearInterval(intervalId);
      document.getElementById("countdown").innerHTML = "";
      return;
    }
  }, 1000);
}

startCountdown();
