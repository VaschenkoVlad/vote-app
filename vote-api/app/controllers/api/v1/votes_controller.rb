class Api::V1::VotesController < ApplicationController
  def create
    vote = Vote.new(vote_params)

    if vote.save
      ActionCable.server.broadcast("poll_#{vote.poll_id}", vote.as_json)
      render json: vote, status: :created
    else
      render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
    def vote_params
      params.require(:vote).permit(:option, :poll_id)
    end
end
