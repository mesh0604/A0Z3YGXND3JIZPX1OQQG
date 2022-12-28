Parse.initialize("7FLK8xKUIGeXPRHarWfxNsjsh0NDkrHOydTYD4Wy", "fRJOTHkpLgpHIBHpdmYbK3duVXBfKvy5UEv6FI5u");
Parse.serverURL = "https://parseapi.back4app.com/";
var parseGuest = new Object();

async function parseLoadGuest(guestid) {
    const query = new Parse.Query("dbGuests");
    //query.equalTo("uuid", guestid);
    query.equalTo("objectId", guestid);
    await query.first().then(function (guestObject) {
        if (guestObject) {
            parseGuest.id = guestObject.id;
            parseGuest.uuid = guestObject.get('uuid');
            parseGuest.name = guestObject.get('name');
            parseGuest.role = guestObject.get('role');
            parseGuest.side = guestObject.get('side');
            parseGuest.status = guestObject.get('status');
            parseGuest.addedBy = guestObject.get('addedBy');
            parseGuest.companionCount = guestObject.get('companionCount');
            LoadGuestStatus();
        }
        else {
            console.log('Error: Guest not found');
            $('#story-title').css('margin-top', '100px');
            return false;
        }
    }).catch(function (response, error) {
        console.log(`Error: ${error.message}`);
        return false;
    });
}

var companionCounterLength = 0;
var companionCounterActual = 0;

async function parseClearCompanions(uuid) {
    const queryComps = new Parse.Query("dbCompanions");
    queryComps.equalTo("uuidGuest", uuid);
    const comps = await queryComps.limit(20).find();
    companionCounterLength = comps.length;

    var parseIntervalClear = setInterval(function() {
        if (companionCounterActual == companionCounterLength) {
            location.reload();
            clearInterval(parseIntervalClear);
        }
    }, 1000);
    
    if (companionCounterLength) {
        $(comps).each(function (i, data) {
            parseDestroyCompanion(data);
        });
    }
}

async function parseDestroyCompanion(companion) {
    await companion.destroy();
    companionCounterActual++;
}

function parseAddCompanions(uuid, guest) {
    companionCounterLength = $('.text-companion').length;
    var parseIntervalClear = setInterval(function() {
        if (companionCounterActual == companionCounterLength) {
            location.reload();
            clearInterval(parseIntervalClear);
        }
    }, 1000);

    if (companionCounterLength) {
        $('.text-companion').each(function () {
            if ($(this).val()) {
                let compObject = new Parse.Object("dbCompanions");
                compObject.set("uuidGuest", uuid);
                compObject.set("name", $(this).val());
                compObject.set("addedBy", guest);
                parseSaveCompanion(compObject);
            }
        });
    }
}

async function parseSaveCompanion(companion) {
    await companion.save();
    companionCounterActual++;
}

async function parseResetRSVP() {
    $('#loadingParse').fadeIn();
    let guestObject = new Parse.Object("dbGuests");
    guestObject.set("objectId", parseGuest.id);
    guestObject.set("status", "PENDING");

    guestObject.set("uuid", parseGuest.uuid);
    guestObject.set("name", parseGuest.name);
    guestObject.set("role", parseGuest.role);
    guestObject.set("side", parseGuest.side);
    guestObject.set("companionCount", parseGuest.companionCount);
    guestObject.set("addedBy", "admin");

    try {
        guestObject = await guestObject.save();

        if (guestObject !== null) {
            console.log("Guest status saved.");
            parseClearCompanions(parseGuest.uuid);
        }
        else {
            return false;
        }
    } catch (error) {
        $('#loadingParse').fadeOut();
        alert('Something went wrong, please check logs.');
        console.log(`Error: ${error.message}`);
        return false;
    }
}

async function parseDeclineRSVP(reason) {
    $('#loadingParse').fadeIn();
    let guestObject = new Parse.Object("dbGuests");
    guestObject.set("objectId", parseGuest.id);
    guestObject.set("status", "DECLINE");
    guestObject.set("reason", reason);

    guestObject.set("uuid", parseGuest.uuid);
    guestObject.set("name", parseGuest.name);
    guestObject.set("role", parseGuest.role);
    guestObject.set("side", parseGuest.side);
    guestObject.set("companionCount", parseGuest.companionCount);
    guestObject.set("addedBy", "admin");

    try {
        guestObject = await guestObject.save();
        if (guestObject !== null) {
            console.log("Guest status saved.");
            location.reload();
        }
        else {
            return false;
        }
    } catch (error) {
        $('#loadingParse').fadeOut();
        alert('Something went wrong, please check logs.');
        console.log(`Error: ${error.message}`);
        return false;
    }
}

async function parseAcceptRSVP() {
    $('#loadingParse').fadeIn();
    let guestObject = new Parse.Object("dbGuests");
    guestObject.set("objectId", parseGuest.id);
    guestObject.set("status", "ACCEPT");

    guestObject.set("uuid", parseGuest.uuid);
    guestObject.set("name", parseGuest.name);
    guestObject.set("role", parseGuest.role);
    guestObject.set("side", parseGuest.side);
    guestObject.set("companionCount", parseGuest.companionCount);
    guestObject.set("addedBy", "admin");

    try {
        guestObject = await guestObject.save();

        if (guestObject !== null) {
            console.log("Guest status saved.");
            parseAddCompanions(parseGuest.uuid, parseGuest.name);
        }
        else {
            return false;
        }
    } catch (error) {
        $('#loadingParse').fadeOut();
        alert('Something went wrong, please check logs.');
        console.log(`Error: ${error.message}`);
        return false;
    }
}

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let guestid = params.get('q');
parseLoadGuest(guestid);