// app/game/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Card from "../components/Card";
import { Card as CardType, Player } from "../types";
import { connectSocket, disconnectSocket } from "../utils/socket";
import PlayerList from "../components/PlayerList";

const GamePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const playerName = searchParams.get("playerName");
    const roomId = searchParams.get("roomId");

    const [hand, setHand] = useState<CardType[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
    const [partyLeaderId, setPartyLeaderId] = useState<string | null>(null);
    const [playedCards, setPlayedCards] = useState<
        { playerId: string; card: CardType }[]
    >([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [bidSubmitted, setBidSubmitted] = useState(false);

    useEffect(() => {}, []);

    useEffect(() => {
        console.log("use effect ran");

        // Check if playerName and roomId are present
        if (!playerName || !roomId) {
            // Redirect to home page
            router.push("/");
            return;
        }

        // Initialize socket connection
        const gameSocket = connectSocket({
            playerName: String(playerName),
            roomId: String(roomId),
        });
        setSocket(gameSocket);

        gameSocket.on("connect", () => {
            console.log("Connected to server with ID:", gameSocket.id);
        });

        // Emit join_room event
        gameSocket.emit("join_room", { roomId, playerName });

        // Listen for events
        gameSocket.on("deal_hand", (cards: CardType[]) => {
            setHand(cards);
            setMessage("Bidding phase: Please submit your bid.");
        });

        gameSocket.on("player_list", ({ players, partyLeaderId }) => {
            setPlayers(players);
            setPartyLeaderId(partyLeaderId);
        });

        gameSocket.on("party_leader_changed", ({ partyLeaderId }) => {
            setPartyLeaderId(partyLeaderId);
        });

        gameSocket.on("start_bidding", () => {
            setIsBidding(true);
        });

        gameSocket.on("bid_submitted", ({ playerId, bid }) => {
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.id === playerId ? { ...player, bid } : player
                )
            );
        });

        gameSocket.on(
            "start_play",
            ({ currentPlayerId }: { currentPlayerId: string }) => {
                setCurrentPlayerId(currentPlayerId);
                setMessage("Play phase started.");
            }
        );

        gameSocket.on(
            "next_turn",
            ({ currentPlayerId }: { currentPlayerId: string }) => {
                setCurrentPlayerId(currentPlayerId);
            }
        );

        gameSocket.on(
            "card_played",
            ({ playerId, card }: { playerId: string; card: CardType }) => {
                setPlayedCards((prev) => [...prev, { playerId, card }]);
                if (gameSocket && playerId === gameSocket.id) {
                    console.log("true");

                    setHand((prev) =>
                        prev.filter(
                            (c) =>
                                c.suit !== card.suit || c.value !== card.value
                        )
                    );
                }
                console.log(gameSocket.id);
                console.log(playerId);
                console.log(card);
            }
        );

        gameSocket.on("invalid_move", (message: string) => {
            alert(message);
        });

        gameSocket.on("invalid_player_count", (message: string) => {
            alert(message);
        });

        gameSocket.on("trick_won", (playersList: Player[]) => {});

        gameSocket.on(
            "next_trick",
            ({ currentPlayerId }: { currentPlayerId: string }) => {
                setPlayedCards([]);
                setCurrentPlayerId(currentPlayerId);
            }
        );

        gameSocket.on("round_over", ({ players }) => {
            // Handle round over, show scores, etc.
            setMessage("Round over.");
            setPlayers(players);
        });

        // gameSocket.on("invalid_move", (msg: string) => {
        //     alert(msg);
        // });

        gameSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        gameSocket.on("error", (err) => {
            console.error("Socket error:", err);
        });

        // Clean up the socket connection only on unmount
        return () => {
            disconnectSocket();
        };
    }, [playerName, roomId, router]);

    // useEffect(() => {
    //     if (socket) {
    //         socket.on("message", (msg: string) => {
    //             setMessage(msg);
    //         });
    //     }
    // }, [socket, setMessage]);

    // Function to submit a bid
    const submitBid = (bid: number) => {
        if (socket) {
            socket.emit("submit_bid", { roomId, bid });
        }
        setBidSubmitted(true);
        setIsBidding(false);
    };

    function isPartyLeader() {
        if (!socket) {
            return false;
        }
        return partyLeaderId === socket.id;
    }

    // Function to play a card
    const playCard = (card: CardType) => {
        if (!isMyTurn) {
            alert("It's not your turn.");
            return;
        }

        if (socket) {
            socket.emit("play_card", { roomId, card });
        }
    };

    const startGame = () => {
        if (socket) {
            socket.emit("start_game", { roomId }); // Replace with your actual roomId
        }
    };

    const transferLeadership = (newLeaderId: string) => {
        if (socket) {
            socket.emit("transfer_leadership", {
                roomId: roomId,
                newLeaderId,
            });
        }
    };

    // Check if it's the player's turn
    const isMyTurn = socket && currentPlayerId === socket.id;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Spades Game</h1>
            <p>{message}</p>
            <PlayerList
                players={players}
                currentPlayerId={currentPlayerId}
                socket={socket}
                partyLeaderId={partyLeaderId}
            />
            {hand.length > 0 && (
                <div>
                    <h2 className="font-semibold">Your Hand:</h2>
                    <div className="flex space-x-2 flex-wrap">
                        {hand.map((card, index) => (
                            <Card
                                key={index}
                                suit={card.suit}
                                value={card.value}
                                onClick={() => {
                                    playCard(card);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            {playedCards.length > 0 && (
                <div>
                    <h2 className="font-semibold">Current Trick:</h2>
                    <div className="flex space-x-2">
                        {playedCards.map((play, index) => (
                            <div key={index} className="text-center">
                                <p className="text-sm">
                                    {
                                        players.find(
                                            (p) => p.id === play.playerId
                                        )?.name
                                    }
                                </p>
                                <Card
                                    suit={play.card.suit}
                                    value={play.card.value}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Bid submission if in bidding phase */}
            {isBidding && !bidSubmitted && (
                <div>
                    <h2 className="font-semibold">Submit your bid:</h2>
                    <div className="flex space-x-2 flex-wrap">
                        {Array.from({ length: 14 }, (_, i) => i).map((bid) => (
                            <button
                                key={bid}
                                className="p-2 rounded m-1"
                                onClick={() => submitBid(bid)}
                            >
                                {bid}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {isPartyLeader() && (
                <PartyLeaderControls
                    partyLeaderId={partyLeaderId}
                    startGame={startGame}
                    players={players}
                    transferLeadership={transferLeadership}
                />
            )}
        </div>
    );
};

export default GamePage;
