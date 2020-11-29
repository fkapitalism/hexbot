var foo = $jSpaghetti.module("missions")
foo.config.debugMode = true

foo.procedure("getURLMission", function(shared, hooks){

	var labels = {
				checkBalance: ["Verificar balanço bancário", "Check bank status"],
				transferMoney: ["Transferir dinheiro", "Transfer money"],
				stealSoftware: ["Roubar software", "Steal software"],
				deleteSoftware: ["Deletar software", "Delete software"]
			 }

	function getURL(missionType) { //It returns a mission url by mission type
		//Get the URL mission
		var element = document.getElementsByTagName("a")
		var urlMission = null
		var urlIsObtained = false
		for (count = 0; count <= element.length - 1; count++) {
			var aux = element[count]
			var url = aux.href
			aux = aux.childNodes[0]
			linkText = aux.nodeValue
			if (linkText != null) {
				if (missionType == CHECK_BALANCE) {
					if (strposOfArray(linkText, labels.checkBalance) >= 0){
						urlMission = url
						break
					}
				} else
				if (missionType == TRANSFER_MONEY) {
					if (strposOfArray(linkText, labels.transferMoney) >= 0){
						urlMission = url
						break
					}
				}
				if (missionType == DELETE_SOFTWARE) {
					if (strposOfArray(linkText, labels.deleteSoftware) >= 0){
						urlMission = url
						break
					}
				}
			}
		}
		return urlMission
	}
	var urlMission = getURL(shared.missionType) //It catches the first available mission URL
	shared.urlMission = urlMission

	if (urlMission){
		setTimeout(function(){
			hooks.next("Ok. I got a mission.")
		},100);
	} else {
		var timeToNextMissions = getDOMElement("b", null, null, 0).childNodes[0].nodeValue; //Get the time missing to next missions package
		if (timeToNextMissions > 0){
			baz = document.createElement("div");
			baz.id = "secondsCounterContainer";
			getDOMElement("div", "class", "widget-content padding", 0).appendChild(baz);

			var count = (timeToNextMissions * 60) - 50;
			var counterDelay = 0;
			var delay = setInterval(function(){
						getDOMElement("div", "id", "secondsCounterContainer", 0).innerHTML = "Updating list in " + (count - counterDelay) + " seconds";
						counterDelay++;
						if (counterDelay >= count) {
							clearInterval(delay);
							hooks.next("Ok. Time is over.")
						}
					}, 1000); //Repeat the function every second

		} else {
			setTimeout(function(){
				hooks.next("Ok. I got time 0.")
			}, 3000)
		} 
	}
})

foo.procedure("boo", function(){
	return null
})

foo.procedure("goToMissionsTab", function(){
	goToPage("/missions")
	return null
})

foo.procedure("informBalance", function(shared){
	getDOMElement("input", "id", "amount-input", 0).value = shared.balance //Fill the balance field with the balance value
	getDOMElement("span", "class", "btn btn-success mission-complete", 0).click() //Click on the Complete Mission Button
	return null
})

foo.procedure("confirmMissionCompleteButton", function(){
	getDOMElement("input", "id", "modal-submit", 0).click()
	return null
})

foo.procedure("goToAcceptMissionPage", function(shared){
	window.location.href = shared.urlMission
	return null
})

foo.procedure("abc", function(shared){
	console.log(shared)
	return null
})

foo.procedure("goToNextIp", function(shared){
	goToPage("/internet?ip=" + shared.ips[shared.nextIp])
	shared.nextIp++
	return null
})

foo.procedure("goToBankAccountHacker", function(shared){
	goToPage("/internet?action=hack&type=bank")
	return null
})

foo.procedure("goToBankAccountHacker", function(shared){
	goToPage("/internet?action=hack&type=bank")
	return null
})

foo.procedure("hackAccount", function(shared){
	goToPage("/internet?action=hack&acc=" + shared.accounts[0])
	return null
})

foo.procedure("transferMoneyToTarget", function(shared){
	getDOMElement("input", "name", "acc", 0).value = shared.accounts[1]; //Fill the To field
	getDOMElement("input", "name", "ip", 1).value = shared.ips[1]; //Fill the Bank IP field
	getDOMElement("button", "class", "btn btn-success", 0).click(); //Click on the Transfer Money button
	return null
})

foo.procedure("signInAccount", function(shared){
	if (getDOMElement("div", "class", "alert alert-error", 0)){
		getDOMElement("input", "name", "acc", 0).value = shared.accounts[0]; //Fill the account field
		getDOMElement("input", "name", "pass", 0).value = getDOMElement("strong", null, null, 1).childNodes[0].nodeValue; //Fill the password field with the password on screen
	}
	getDOMElement("input", "type", "submit", 1).click(); //Click on the Login button
	return null
})

foo.procedure("getAccountBalance", function(shared){
	shared.balance = getDOMElement("strong", null, null, 0).childNodes[0].nodeValue; //Get the account balance
	return null
})

foo.procedure("getOutFromAccount", function(shared){
	goToPage("/internet?bAction=logout")
	return null
})

foo.procedure("logout", function(){
	goToPage("/internet?view=logout")
	return null
})

foo.procedure("clickOnAcceptMissionButton", function(shared){
	const button = getDOMElement("span", "class", "btn btn-success mission-accept", 0)
	console.log(button)
	button.click()
	return null
})

//Click on the div float Accept mission button
foo.procedure("clickOnConfirmAcceptMissionButton", function(shared){
	const button = getDOMElement("input", "type", "submit", 0)
	console.log(button)
	button.click()
	return null
})

foo.procedure("waitForSubmitButton", function(shared, hooks){
	var loop = setInterval(function(){
		var button = getDOMElement("input", "type", "submit", 0)
		var labels = ["Accept", "Aceitar", "Complete Mission", "Completar Missão", "Abort", "Abortar"]
		if (button){
			if ((!button.disabled) && (strposOfArray(button.value, labels) >= 0)){
				clearInterval(loop)
				var destinationAccountContainer = document.getElementById("s2id_select-bank-acc")
				if(destinationAccountContainer){
					var account = destinationAccountContainer.innerHTML.match(/#[0-9]+/gm)
					if ((account) && (account.length > 0))
					shared.destinationAccount = account[0].replace("#", "")
				} else {
					shared.destinationAccount = null
				}
				hooks.next("Button is ready!")
			}
		}
	}, 100)
})

foo.procedure("test0", function(shared, hooks){
	shared.destinationAccount = '794301403'
	return null
})

foo.procedure("test", function(shared, hooks){
	/*var accountBalance = */
	getBankAccountsBalance((result) => {
		var accountBalance = result[shared.destinationAccount]
		getBTCExchangeRate((btcExchangeRate) => {
			var bitcoinsToBuy = roundNumber(accountBalance / btcExchangeRate)
			if (bitcoinsToBuy >= 0.1){
				sendMoneyToBTCWallet(shared.destinationAccount, bitcoinsToBuy, () => {
					console.log("Account " + shared.destinationAccount + ": $" + accountBalance + " - " + bitcoinsToBuy + " BTC bought")
					hooks.next()
				})
			} else {
				console.log("Money is not enough to buy a bitcoin")
				hooks.next()
			}
		})
	})
})

foo.procedure("clickOnAbortMissionButton", function(shared){
	getDOMElement("span", "class", "btn btn-danger mission-abort", 0).click()
	return null
})

foo.procedure("showMessage", function(shared){
	if(shared.missionType == DELETE_SOFTWARE){
		if(!shared.softwareId){
			window.alert(LANG.WEBCRAWLER_SOFTWARE_NOT_FOUND.replace('{CONTENT1}', shared.softwareInfo.name).replace('{CONTENT2}', shared.softwareInfo.version))
		}
	}
	return null
})

foo.procedure("clickOnConfirmAbortMissionButton", function(shared){
	getDOMElement("input", "type", "submit", 0).click()
	return null
})

foo.procedure("isThereMessageError", function(){
	if (getDOMElement("div", "class", "alert alert-error", 0))
		return true
	return null
})

foo.procedure("isCrackerStrongEnough", function(){
	var errorContainer = getDOMElement("div", "class", "alert alert-error", 0)
	var labels = ["You do not have the needed software to perform this action", "Vocẽ não tem o software necessário para realizar essa ação", "your cracker is not good enough", "seu cracker não é bom o suficiente"]
	if (errorContainer){
		if(strposOfArray(errorContainer.innerHTML, labels) >= 0)
		return false
	}
	return true
})

foo.procedure("askPermissionToAbort", function(shared){
	shared.abortMissionAllowed = window.confirm(LANG.MISSIONS_PERMISSION_TO_ABORT)
	return null
})

foo.procedure("getMissionInfo", function(shared){
	//Get ips
	try{
		shared.ips.push(getDOMElement("a", "class", "small", 0).childNodes[0].nodeValue)
		shared.ips.push(getDOMElement("a", "class", "small", 1).childNodes[0].nodeValue)
	}catch(error){
		console.log(error.message)
	}
	//Get accounts
	element = document.getElementsByTagName("td");
	for(i = 0; i <= element.length - 1; i++){
		var aux = element[i]
		aux = aux.childNodes[0]
		aux = aux.nodeValue
		if (aux != null){
			if (aux.search("#") >= 0){
				shared.accounts.push(aux.substr(1, aux.length - 1))
			}   
		}
	}
	return null
})

foo.procedure("getDeleteSoftwareMissionInfo", function(shared){
	var infoTable = document.getElementsByClassName("table table-cozy table-bordered table-striped")[0]
	var softwareData = document.getElementsByTagName("TD")[3]
	var targetIp = document.getElementsByTagName("TD")[1].innerText.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)[0]
	var softwareVersion = softwareData.getElementsByTagName("span")[0].innerText
	var softwareName = softwareData.innerText.replace(softwareVersion, "")
	shared.ips = [targetIp]
	shared.softwareInfo = {name: softwareName, version: softwareVersion}
	return null
})

foo.procedure("forceToAccessTarget", function(){
	goToPage("/internet?action=hack")
	return null
})

foo.procedure("signInKnownTarget", function(){
	getDOMElement("input", "type", "submit", 1).click(); //Click on the Login button
	return null
})

foo.procedure("hackTargetBruteForce", function(){
	goToPage("/internet?action=hack&method=bf")
	return null
})

foo.procedure("cleanMyIpClues", function(data, hooks){
	getMyIp(true, (myip) => {
		var textArea = getDOMElement("textarea", "class", "logarea", 0)
		if (textArea.value.length > 0){
			data.isEmpty = false
			//var pattern = new RegExp("^.*" + getMyIp(true) + ".*$")
			var pattern = new RegExp("^.*" + myip + ".*$")
			textArea.value = removeLinesFromText(textArea.value, pattern)
			getDOMElement("input", "class", "btn btn-inverse", "last").click()
		} else {
			data.isEmpty = true
		}
		if(data.cleanerCount != undefined) data.cleanerCount++
		hooks.next()
	})
})

foo.procedure("cleanTextAreaContent", function(data){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if (textArea.value.length > 0){
		data.isEmpty = false
		textArea.value = ""
		getDOMElement("input", "class", "btn btn-inverse", "last").click()
	} else {
		data.isEmpty = true
	}
	if(data.cleanerCount != undefined) data.cleanerCount++
	return null
})

foo.procedure("informBadCracker", function(){
	window.alert(LANG.MISSIONS_WEAK_CRACKER)
	return null
})

foo.procedure("goToOwnLogTab", function(){
	goToPage("/log")
	return null
})

foo.procedure("checkSameTypeAcceptedMission", function(shared){
	var labels = {
			checkBalance: ["balance", "balanço"],
			transferMoney: ["transfer", "transferir"],
			//stealSoftware: ["Roubar software", "Steal software"],
			deleteSoftware: ["remove the file", "wipe out the file", "remova o arquivo", "delete o arquivo", "suma com o arquivo"]
		 }
	var missionDescription = getDOMElement("div", "class", "article-post", 0)
	console.log(missionDescription)
	if ((missionDescription) && (strposOfArray(missionDescription.innerHTML, labels[shared.missionType]) >= 0)){
		return true
	} 
	return null
})

foo.procedure("isAvailableMissionsPage", function(){
	labels = ["Missões disponíveis", "Available missions"]
	var titleElement = getDOMElement("h5", null, null, 0)
	if (titleElement){
		if(strposOfArray(titleElement.childNodes[0].nodeValue, labels) >= 0){
			return true
		}
	}
	return null
})

foo.procedure("alertAnotherMissionKindAlreadyAccepted", function(){
	window.alert(LANG.MISSION_ANOTHER_MISSION_KIND_ALREADY_ACCEPTED)
	return null
})

foo.procedure("clickOnFinishButton", function(){
	 getDOMElement("span", "class", "btn btn-success mission-complete", 0).click();
	 return null
})

/*foo.procedure("checkProgressBar", function(shared, funcs){
	var loop = setInterval(function(){
		var progressBar = getDOMElement("div", "role", "progressbar", 0)
		if(!progressBar){
			clearInterval(loop)
			funcs.sendSignal("Mishchap, go ahead. It'll never crash anymore ;)")
		}
	}, 50)
	return null
})*/

foo.procedure("waitProgressBar", function (shared, hooks) {
    var loop = setInterval(function () {
        var progressBar = getDOMElement("div", "role", "progressbar", 0)
        if (!progressBar) {
            clearInterval(loop)
            hooks.next()
        }
    }, 100)
})


foo.procedure("checkFunds", function(shared){
	var fundsContainer = getDOMElement("ul", "class", "finance-box", 0)
	var funds = fundsContainer.innerHTML.match(/\$[0-9,]+/)[0].replace(/[\$,]/gm, '')
	shared.funds = Number(funds)
	if (shared.funds > 0){
		return true
	} else {
		return false
	}
})

foo.procedure("transferRandomValueToTarget", function(shared){
	if (shared.funds > 10){
		shared.transferredValue = Math.floor(Math.random() * 10) + 1
	} else {
		shared.transferredValue = shared.funds
	}
	shared.rest = shared.funds - shared.transferredValue
	getDOMElement("input", "name", "acc", 0).value = shared.accounts[1]
	getDOMElement("input", "name", "ip", 1).value = shared.ips[1]
	getDOMElement("input", "name", "money", 0).value = "$" + shared.transferredValue
	getDOMElement("button", "class", "btn btn-success", 0).click()
	return null
})

foo.procedure("transferToMe", function(shared){
	var myAccount = shared.myAccountsInfo[shared.ips[0]]
	if(myAccount){
		shared.destinationAccount = myAccount
		getDOMElement("input", "name", "acc", 0).value = myAccount
		getDOMElement("input", "name", "ip", 1).value = shared.ips[0]
		getDOMElement("button", "class", "btn btn-success", 0).click()
	}
	return null
})

foo.procedure("transferTheRestToMe", function(shared){
	var myAccount = shared.myAccountsInfo[shared.ips[1]]
	if(myAccount){
		shared.destinationAccount = myAccount
		getDOMElement("input", "name", "acc", 0).value = myAccount
		getDOMElement("input", "name", "ip", 1).value = shared.ips[1]
		getDOMElement("button", "class", "btn btn-success", 0).click()
	}
	return null
})

foo.procedure("goToLoginPage", function(){
	if (location.href.indexOf("/internet?action=login") == -1)
	goToPage("/internet?action=login")
	return null
})

foo.procedure("goToPageAccountLoginPage", function(shared){
	if (location.href.indexOf("/internet?action=login&type=bank") == -1)
	goToPage("/internet?action=hack&acc=" + shared.accounts[0])
	return null
})

/*foo.procedure("waitForSubmitButton", function(shared, funcs){
	var loop = setInterval(function(){
		var button = getDOMElement("input", "type", "submit", 0)
		var labels = ["Accept", "Aceitar", "Complete Mission", "Completar Missão", "Abort", "Abortar"]
		if (button){
			if ((!button.disabled) && (strposOfArray(button.value, labels) >= 0)){
				clearInterval(loop)
				var destinationAccountContainer = document.getElementById("s2id_select-bank-acc")
				if(destinationAccountContainer){
					var account = destinationAccountContainer.innerHTML.match(/#[0-9]+/gm)
					if ((account) && (account.length > 0))
					shared.destinationAccount = account[0].replace("#", "")
				} else {
					shared.destinationAccount = null
				}
				funcs.sendSignal("Button is ready!")
			}
		}
	}, 50)
	return null
})*/

foo.procedure("sendMoneyToBTCWallet", function(shared, hooks){
	if(shared.isBTCLogged){
		/*var accountBalance = */
		/*var accountBalance = */
		getBankAccountsBalance((result) => {
			var accountBalance = result[shared.destinationAccount]
			getBTCExchangeRate((btcExchangeRate) => {
				var bitcoinsToBuy = roundNumber(accountBalance / btcExchangeRate)
				if (bitcoinsToBuy >= 0.1){
					sendMoneyToBTCWallet(shared.destinationAccount, bitcoinsToBuy, () => {
						console.log("Account " + shared.destinationAccount + ": $" + accountBalance + " - " + bitcoinsToBuy + " BTC bought")
						hooks.next()
					})
				} else {
					console.log("Money is not enough to buy a bitcoin")
					hooks.next()
				}
			})
		})

	} else {
		console.log("BTC wallet unavailable")
		return null
	}
})

foo.procedure("goToTargetLogs", function(){
	if (!getDOMElement("textarea", "class", "logarea", 0) || (location.href.indexOf("/internet") == -1))
	goToPage("/internet?view=logs")
	return null
})

foo.procedure("cancelLogProcesses", function(shared, hooks){
	//var processesPage = 
	sendXMLHttpRequest("/processes", "GET", "", false, (processesPage) => {

		var parser = new DOMParser()
		var requestContentDOM = parser.parseFromString(processesPage, "text/html")
		var container = requestContentDOM.getElementsByClassName("widget-content padding noborder")
		var processesId = []
		if((container) && (container.length > 0)){
			var processes = container[0].getElementsByTagName("LI")
			if ((processes) && (processes.length > 0)){
				var labels = ["Edit log at", "Editar log at"]
				for (var i = 0; i < processes.length; i++) {
					if(strposOfArray(processes[i].innerHTML, labels) >= 0){
						var pidContainer = processes[i].innerHTML.match(/processBlock[0-9]+/)
						if(pidContainer){
							var pid = pidContainer[0].match(/[0-9]+/)
							processesId.push(pid[0])
						}
					}
				}
			}
		}
		if(processesId.length){
			for (var i = 0; i < processesId.length; i++) {
				sendXMLHttpRequest("/processes", "GET", "pid=" + processesId[i] + "&del=1", false, () => {
					console.log("HExBot webcrawler: Process " + processesId[i] + " is terminated")
					if(i === processesId.length - 1){
						hooks.next()
					}
				})
			}
		} else {
			hooks.next()
		}

	})
		
})

foo.procedure("checkBTCWallet", function(shared, hooks){
	shared.transferToBTC = controllers.bot.controlPanel.checkBoxes[SET_TRANSFER_TO_BTC]

	if(shared.transferToBTC){
		/*shared.BTCInfo = */
		getBTCWalletInfo((info) => {
			shared.BTCInfo = info

			if(!shared.BTCInfo.isLogged){
				shared.isBTCLogged = false
				window.alert(LANG.DISCONNECTED_BTC_WALLET)
				//return false
				hooks.next(false)
			} else {
				shared.isBTCLogged = true
				//return true
				hooks.next("true")
			}

		});
		//console.log(shared.BTCInfo)
	} else {
		return true
	}

})

foo.procedure("getSoftwareId", function(shared, hooks){
	/*shared.softwareId = */
	getSoftwareId(shared.softwareInfo.name, shared.softwareInfo.version, "/internet", "view=software", (result) => {
		shared.softwareId = result
		hooks.next(result)
	})
	//return shared.softwareId
})

foo.procedure("deleteSoftware", function(shared){
	goToPage("/internet?view=software&cmd=del&id=" + shared.softwareId)
	return null
})

foo.procedure("startCheckBalance", function(shared, hooks){
	/*shared.myAccountsInfo = */
	getBankAccountAddr((info) => {
		shared.myAccountsInfo = info
		shared.missionType = CHECK_BALANCE
		shared.ips = []
		shared.accounts = []
		shared.nextIp = 0
		//return true
		hooks.next(true)
	})	
})

foo.procedure("startDeleteSoftware", function(shared, hooks){
	/*shared.myAccountsInfo = */
	getBankAccountAddr((info) => {
		shared.myAccountsInfo = info
		shared.missionType = DELETE_SOFTWARE
		shared.ips = []
		shared.nextIp = 0
		shared.softwareInfo = {}
		//return true
		hooks.next(true)
	})		
})

foo.procedure("startTransferMoney", function(shared, hooks){
	/*shared.myAccountsInfo = */
	getBankAccountAddr((info) => {
		shared.myAccountsInfo = info
		shared.missionType = TRANSFER_MONEY
		shared.ips = []
		shared.accounts = []
		shared.cleanerCount = 0
		shared.nextIp = 0
		//return true
		hooks.next(true)
	})
})
