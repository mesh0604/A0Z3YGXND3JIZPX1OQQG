$(function () {
  $('.image-splash').width($('.image-splash').parent().width());
  $('.image-splash').height(360);

  $('#btnAcceptRSVP').click(function() {
    parseAcceptRSVP();
  });

  $('#btnDeclineRSVP').click(function() {
    parseDeclineRSVP($('#txtDeclineReason').val());
  });

  $('#btnResetRSVP').click(function() {
    parseResetRSVP();
  });
});

$(window).load(function () {
  $('body').css("overflow", "auto");
  $("#loadingScreen").fadeOut("slow", function () {
    AOS.init({ disable: 'mobile' });
  });
});

var countDownDate = new Date("Jan 21, 2023 15:00:00").getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  $('#txtCountdown').html(days + ":" + addLeadingZeros(hours, 2) + ":" + addLeadingZeros(minutes, 2) + ":" + addLeadingZeros(seconds, 2));

  if (distance < 0) {
    clearInterval(x);
    $('#txtCountdown').html("00:00:00:00");
  }
}, 1000);


function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

function LoadGuestStatus() {
  if (parseGuest.status == "PENDING") {
    $('#groupPending').fadeIn();
  }
  else {
    $('#groupUnpending').fadeIn();
  }

  $('#blkAcceptName').html(parseGuest.name);
  $('#blkDeclineName').html(parseGuest.name);
  $('#blkResetName').html(parseGuest.name);
  $('#blkAcceptCompanionCount').html(parseGuest.companionCount);

  if (parseGuest.companionCount) {
    for (let i = 1; i <= parseGuest.companionCount; i++) {
      var textForm = '';
      if (i == parseGuest.companionCount) {
        textForm = '<div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control text-companion" placeholder="Companion #' + i + '"></div>';
      }
      else {
        textForm = '<div class="form-group"><input type="text" class="form-control text-companion" placeholder="Companion #' + i + '"></div>';
      }

      $('#companion-container').append(textForm);
    }
  }
  else {
    $('#companion-container').remove();
  }
}