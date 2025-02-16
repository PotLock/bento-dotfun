'use client';

import { useNear } from '@/context/near-context';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import Image from 'next/image';
import { Markdown } from '@prisma/client';
import Link from 'next/link';

interface User {
  id: string;
  address: string;
  image: string;
  displayOrder: string[];
  markdowns: Markdown[];
}

export default function ProfilePage() {
  const { wallet, signedAccountId } = useNear();
  const [markdowns, setMarkdowns] = useState<Markdown[]>([]);
  const [allUserMarkdowns, setAllUserMarkdowns] = useState<Markdown[]>([]);
  const [balance, setBalance] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (signedAccountId) {
      fetchUserData();
    }
  }, [signedAccountId]);

  const fetchUserData = async () => {
    try {
      // Fetch user data including their markdowns and display order
      const userResponse = await fetch(`/api/user?address=${signedAccountId}`);
      const userData: User = await userResponse.json();
      setUserData(userData);

      // Fetch all user's markdowns
      const markdownResponse = await fetch(`/api/markdown/get-by-address?userAddress=${signedAccountId}`);
      const markdownData = await markdownResponse.json();
      setAllUserMarkdowns(markdownData);

      // Set displayed markdowns based on user's displayOrder
      if (userData.displayOrder.length > 0) {
        const orderedMarkdowns = userData.displayOrder
          .map(id => markdownData.find((m: Markdown) => m.id === id))
          .filter(Boolean);
        setMarkdowns(orderedMarkdowns);
      } else {
        setMarkdowns([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddMarkdown = async (markdown: Markdown) => {
    setMarkdowns(prev => {
      // Check if markdown is already added
      if (prev.some(m => m.id === markdown.id)) {
        return prev;
      }
      const newMarkdowns = [...prev, markdown];
      // Update user's display order
      updateUserDisplayOrder(newMarkdowns.map(m => m.id));
      return newMarkdowns;
    });
    setIsModalOpen(false);
  };

  const handleRemoveMarkdown = async (id: string) => {
    setMarkdowns(prev => {
      const newMarkdowns = prev.filter(markdown => markdown.id !== id);
      // Update user's display order
      updateUserDisplayOrder(newMarkdowns.map(m => m.id));
      return newMarkdowns;
    });
  };

  const updateUserDisplayOrder = async (displayOrder: string[]) => {
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: signedAccountId,
          displayOrder,
        }),
      });
    } catch (error) {
      console.error('Error updating display order:', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(markdowns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMarkdowns(items);
    // Update user's display order after drag
    updateUserDisplayOrder(items.map(m => m.id));
  };

  const availableMarkdowns = allUserMarkdowns.filter(markdown => 
    !markdowns.some(m => m.id === markdown.id)
  );


  if (!signedAccountId) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto relative opacity-50">
            <Image
              src="/default-avatar.png"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <p className="text-xl text-gray-600">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 group">
            <Image
              src={userData?.image || "/default-avatar.png"}
              alt="Profile"
              fill
              className="rounded-full object-cover ring-4 ring-gray-50"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200" />
          </div>
          <div className="text-center sm:text-left space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
            <div className="space-y-2">
              <Link 
                target="_blank" 
                href={`https://explorer.testnet.near.org/accounts/${signedAccountId}`} 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="font-medium">Address:</span>
                <span className="bg-gray-50 px-3 py-1 rounded-full">
                  {signedAccountId?.slice(0, 6)}...{signedAccountId?.slice(-4)}
                </span>
              </Link>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-medium text-gray-600">Balance:</span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {balance} TOKENS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Markdowns</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Add Markdown to Display
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Select Markdown to Add</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {availableMarkdowns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No available markdowns to add</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableMarkdowns.map(markdown => (
                    <div
                      key={markdown.id}
                      className="p-4 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">{markdown.title}</h4>
                        <div 
                          className="prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: markdown.htmlContent }}
                        />
                        <p className="text-sm text-gray-500">
                          Created: {new Date(markdown.createdAt).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => handleAddMarkdown(markdown)}
                          className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="markdowns">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {markdowns.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No markdowns added to display</p>
                  </div>
                ) : (
                  markdowns.map((markdown, index) => (
                    <Draggable
                      key={markdown.id}
                      draggableId={markdown.id}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="group p-5 bg-gray-50 rounded-xl cursor-move hover:bg-white transition-all duration-200 border border-gray-200 hover:shadow-lg"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-800">{markdown.title}</h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveMarkdown(markdown.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-all duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div 
                              className="prose prose-sm"
                              dangerouslySetInnerHTML={{ __html: markdown.htmlContent }}
                            />
                            <p className="text-sm text-gray-500">
                              Created: {new Date(markdown.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
