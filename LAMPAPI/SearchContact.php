<?php
<?php
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // validate userId
        if (!isset($inData["userId"]) || intval($inData["userId"]) < 1) {
            returnWithError("Invalid userId");
            $conn->close();
            exit();
        }

        // build LIKE pattern and ensure correct bind types: two strings and one integer
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
        $colorName = "%" . $inData["search"] . "%";
        $userIdInt = intval($inData["userId"]);
        $stmt->bind_param("ssi", $colorName, $colorName, $userIdInt);
        $stmt->execute();

        $result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';
        }

        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>